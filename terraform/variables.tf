variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment tag"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project resource-name prefix"
  type        = string
  default     = "tvr-portfolio"
}

variable "instance_type" {
  description = "EC2 instance type; check current regional pricing before use"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing EC2 key pair name; leave empty if SSH access is not required"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "Your public IPv4 address with /32, e.g. 203.0.113.10/32; leave empty to disable SSH"
  type        = string
  default     = ""
}
