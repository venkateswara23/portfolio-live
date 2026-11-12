output "instance_id" {
  description = "Created EC2 instance ID"
  value       = aws_instance.portfolio_server.id
}

output "instance_public_ip" {
  description = "Public IPv4 address"
  value       = aws_instance.portfolio_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS hostname"
  value       = aws_instance.portfolio_server.public_dns
}

output "portfolio_url" {
  description = "Portfolio URL"
  value       = "http://${aws_instance.portfolio_server.public_ip}:8080/"
}

output "deployment_log_location" {
  description = "On-instance cloud-init deployment log"
  value       = "/var/log/portfolio-deploy.log"
}
