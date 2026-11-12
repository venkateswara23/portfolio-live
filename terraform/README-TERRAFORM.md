# Portfolio EC2 deployment with Terraform

This configuration creates a VPC, public subnet, internet gateway, route table,
security group and Ubuntu EC2 instance. EC2 user data installs Docker, clones
the public GitHub repository and runs the portfolio container on port 8080.

## Before applying
- Confirm AWS CLI authentication: `aws sts get-caller-identity`
- Check current EC2, EBS and data-transfer pricing for `ap-south-1`.
- This configuration intentionally leaves SSH disabled by default.
- Public web access is enabled on port 8080.
- Do not open Grafana or Kibana ports publicly. Add VPN, SSM, or restricted
  source-IP access before exposing administrative dashboards.

## Commands (run in this folder)
```powershell
terraform init
terraform fmt
terraform validate
terraform plan
```

Review the plan and estimated charges. Only then run:
```powershell
terraform apply
```
Type `yes` when Terraform asks for confirmation.

When `terraform apply` finishes:
```powershell
terraform output
```
Open the `portfolio_url` in a browser. First boot can take several minutes
while Ubuntu installs Docker and builds the image.

## Cleanup
When you have finished testing, remove resources to stop ongoing instance and
storage charges:
```powershell
terraform destroy
```
Type `yes` to confirm. Verify in the AWS EC2 and VPC consoles that the resources
created by this configuration have been removed.
