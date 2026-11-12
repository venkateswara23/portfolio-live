# AWS EC2 Deployment Guide
## Timmareddy Venkateswara Reddy Portfolio Website

This document covers two methods to deploy your portfolio on an AWS EC2 instance so that it is publicly accessible worldwide:
- **Method 1**: Automated Deployment (using Terraform + Ansible) — **Fastest & Professional**
- **Method 2**: Manual Deployment (using AWS Management Console + Docker)

---

### Method 1: Automated Deployment via Terraform & Ansible

#### Step 1: Provision the Server with Terraform
```bash
cd terraform
terraform init
terraform apply -auto-approve
```
*Take note of the output `instance_public_ip` (e.g. `13.233.150.20`).*

#### Step 2: Deploy with Ansible
Open `ansible/inventory.ini`, update the IP address with `instance_public_ip`, and run:
```bash
cd ../ansible
ansible-playbook playbook.yml
```
Your portfolio will be live at `http://<instance_public_ip>:8080/` within 2 minutes!

---

### Method 2: Manual Deployment via AWS Console

#### 1. Launch EC2 Instance:
1. Log in to [AWS Management Console](https://console.aws.amazon.com/ec2).
2. Click **Launch Instance**.
3. **Name**: `tvr-portfolio-server`.
4. **AMI**: `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type` (64-bit x86).
5. **Instance Type**: `t2.micro` (Free Tier eligible) or `t3.micro`.
6. **Key Pair**: Select or create a new key pair (`tvr-key.pem`), download and save it securely.
7. **Network Settings** > **Security Group**: Allow the following inbound ports:
   - **SSH**: Port `22` (Source: My IP or Anywhere)
   - **HTTP**: Port `80` (Source: Anywhere `0.0.0.0/0`)
   - **HTTPS**: Port `443` (Source: Anywhere `0.0.0.0/0`)
   - **Custom TCP**: Port `8080` (Portfolio App) (Source: Anywhere `0.0.0.0/0`)
   - **Custom TCP**: Port `3000` (Grafana) (Source: Anywhere `0.0.0.0/0`)
   - **Custom TCP**: Port `5601` (Kibana) (Source: Anywhere `0.0.0.0/0`)
8. **Storage**: 20 GiB gp3.
9. Click **Launch Instance**.

#### 2. Connect via SSH:
In PowerShell / Terminal:
```bash
chmod 400 tvr-key.pem   # Linux/Mac (or Windows file properties -> Read only)
ssh -i tvr-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

#### 3. Install Docker & Git on EC2:
```bash
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y docker.io git python3
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
```

#### 4. Clone and Run Your Portfolio Container:
```bash
git clone https://github.com/venkateswara23/portfolio-live.git
cd portfolio-live
docker build -t portfolio-app .
docker run -d --name portfolio-server --restart always -p 8080:8080 -e PORT=8080 portfolio-app
```

#### 5. Verify Public Access:
Open in any browser:
👉 **`http://<YOUR_EC2_PUBLIC_IP>:8080/`**
- Health Probe: `http://<YOUR_EC2_PUBLIC_IP>:8080/health`
- Admin Dashboard: `http://<YOUR_EC2_PUBLIC_IP>:8080/admin.html`
