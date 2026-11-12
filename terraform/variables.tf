# Terraform Input Variables for Timmareddy Venkateswara Reddy Portfolio AWS Infrastructure

variable "aws_region" {
  description = "AWS Region to deploy resources (e.g. ap-south-1 for Mumbai, us-east-1 for N. Virginia)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment tag (e.g., dev, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project identifier tag"
  type        = string
  default     = "tvr-portfolio"
}

variable "instance_type" {
  description = "AWS EC2 instance type (t2.micro / t3.micro are Free Tier eligible)"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the existing AWS Key Pair for SSH access (optional, leave empty if creating without key)"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "CIDR block permitted for SSH access"
  type        = string
  default     = "0.0.0.0/0"
}
