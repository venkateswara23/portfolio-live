# Terraform Outputs for Portfolio AWS Deployment

output "instance_id" {
  description = "ID of the created EC2 Instance"
  value       = aws_instance.portfolio_server.id
}

output "instance_public_ip" {
  description = "Public IPv4 address of the EC2 Instance"
  value       = aws_instance.portfolio_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS hostname of the EC2 Instance"
  value       = aws_instance.portfolio_server.public_dns
}

output "portfolio_url" {
  description = "Direct Web URL to access the Portfolio Application"
  value       = "http://${aws_instance.portfolio_server.public_ip}:8080/"
}

output "ssh_command" {
  description = "Command to SSH into your EC2 Instance"
  value       = var.key_name != "" ? "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.portfolio_server.public_ip}" : "ssh ubuntu@${aws_instance.portfolio_server.public_ip}"
}
