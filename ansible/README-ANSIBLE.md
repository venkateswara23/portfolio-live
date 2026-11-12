# Ansible Server Configuration & Deployment Guide
## Timmareddy Venkateswara Reddy Portfolio

This Ansible playbook completely automates server configuration, dependency installation, Docker containerization, and deployment of the portfolio website on an AWS EC2 instance.

---

### What This Playbook Automates:
1. **System Provisioning**: Updates apt cache and upgrades OS packages.
2. **Docker Installation**: Adds official Docker GPG keys and installs Docker Engine & Docker Compose plugin.
3. **User Permissions**: Configures the `ubuntu` user with Docker privileges.
4. **Git Synchronization**: Clones or pulls the latest code from `https://github.com/venkateswara23/portfolio-live.git`.
5. **Container Build**: Builds the `portfolio-app:latest` Docker image.
6. **Container Run**: Runs the container with auto-restart on port `8080`.
7. **Health Verification**: Asserts that `/health` returns HTTP `200 OK`.

---

### How to Run:

#### 1. Update the Inventory File:
Open `ansible/inventory.ini` and set your EC2 Public IP and SSH key path:
```ini
[portfolio_servers]
portfolio_ec2 ansible_host=3.109.123.45 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/my-key.pem
```

#### 2. Test Connection:
```bash
ansible portfolio_servers -m ping
```

#### 3. Run the Playbook:
```bash
ansible-playbook playbook.yml
```

Once complete, access your live portfolio at:
👉 **`http://<YOUR_EC2_PUBLIC_IP>:8080/`**
