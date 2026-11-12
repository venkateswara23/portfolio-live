# Terraform AWS Infrastructure Automation Guide
## Timmareddy Venkateswara Reddy Portfolio

This Terraform configuration automates the provisioning of complete cloud infrastructure on Amazon Web Services (AWS) for the portfolio application.

---

### Resources Automated by Terraform
- **VPC**: Isolated Virtual Private Cloud (`10.0.0.0/16`)
- **Public Subnet**: Subnet with automatic public IP assignment (`10.0.1.0/24`)
- **Internet Gateway**: Full bidirectional internet access
- **Route Table**: Routes all external traffic to the Internet Gateway
- **Security Group**:
  - Inbound SSH (Port `22`)
  - Inbound HTTP (Port `80`)
  - Inbound HTTPS (Port `443`)
  - Inbound Portfolio Web Server (Port `8080`)
  - Inbound Grafana Dashboard (Port `3000`)
  - Inbound Kibana Dashboard (Port `5601`)
- **EC2 Instance**: Ubuntu 22.04 LTS (Free Tier eligible: `t2.micro` or `t3.micro`)
- **Automated User Data Script**: Automatically boots with Docker, Docker Compose, Git, and Python ready.

---

### Step-by-Step Usage

#### 1. Configure AWS Credentials
Ensure your AWS CLI is configured with your credentials:
```powershell
aws configure
```
*(Enter your AWS Access Key ID, Secret Access Key, and default region `ap-south-1` or `us-east-1`)*.

#### 2. Initialize Terraform
Navigate to the terraform directory:
```powershell
cd "C:\Users\Sai Ram\.gemini\antigravity\scratch\portfolio-main\terraform"
terraform init
```

#### 3. Review Provisioning Plan
```powershell
terraform plan
```

#### 4. Apply & Provision AWS Infrastructure
```powershell
terraform apply -auto-approve
```

#### 5. Outputs Displayed:
Terraform will output:
- **`instance_public_ip`**: The public IPv4 address of your AWS EC2 instance.
- **`portfolio_url`**: `http://<public-ip>:8080/`
- **`ssh_command`**: Ready-to-run SSH command to connect to your server.

---

### Destruction / Teardown
To avoid unnecessary AWS charges when testing is finished:
```powershell
terraform destroy -auto-approve
```
