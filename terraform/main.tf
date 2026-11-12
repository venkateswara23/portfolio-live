terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "portfolio_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "portfolio_igw" {
  vpc_id = aws_vpc.portfolio_vpc.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_subnet" "portfolio_public_subnet" {
  vpc_id                  = aws_vpc.portfolio_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

resource "aws_route_table" "portfolio_public_rt" {
  vpc_id = aws_vpc.portfolio_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.portfolio_igw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "portfolio_rta" {
  subnet_id      = aws_subnet.portfolio_public_subnet.id
  route_table_id = aws_route_table.portfolio_public_rt.id
}

resource "aws_security_group" "portfolio_sg" {
  name        = "${var.project_name}-sg"
  description = "Public web access; optional SSH restricted to the operator IP"
  vpc_id      = aws_vpc.portfolio_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Portfolio application"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = var.allowed_ssh_cidr == "" ? [] : [var.allowed_ssh_cidr]
    content {
      description = "SSH restricted to the configured public IP"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "portfolio_server" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.portfolio_public_subnet.id
  vpc_security_group_ids      = [aws_security_group.portfolio_sg.id]
  associate_public_ip_address = true
  key_name                    = var.key_name == "" ? null : var.key_name

  root_block_device {
    volume_size           = 12
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data_replace_on_change = true
  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail
    exec > >(tee -a /var/log/portfolio-deploy.log) 2>&1

    apt-get update -y
    apt-get install -y ca-certificates curl git docker.io
    systemctl enable --now docker

    rm -rf /opt/portfolio
    git clone --depth 1 https://github.com/venkateswara23/portfolio-live.git /opt/portfolio

    cd /opt/portfolio
    docker build -t portfolio-app:latest .
    docker rm -f portfolio-app || true
    docker run -d \
      --name portfolio-app \
      --restart unless-stopped \
      -p 8080:8080 \
      portfolio-app:latest

    echo "Portfolio deployment completed" >> /var/log/portfolio-deploy.log
  EOF

  tags = {
    Name        = "${var.project_name}-ec2"
    Environment = var.environment
  }

  depends_on = [
    aws_route_table_association.portfolio_rta,
    aws_internet_gateway.portfolio_igw
  ]
}
