# Cloudflare Custom Domain Integration Guide
## Timmareddy Venkateswara Reddy Portfolio

This guide details how to link a custom domain (e.g. `venkateswara.dev` or `timmareddy.me`) to your AWS EC2-hosted portfolio using **Cloudflare DNS** with free SSL/TLS encryption, CDN caching, and DDoS protection.

---

### Step 1: Add Your Domain to Cloudflare
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/) (sign up for free if you don't have an account).
2. Click **Add a Site** / **Add Domain**.
3. Enter your domain name (e.g. `yourname.com`).
4. Select the **Free Plan** ($0 / month) and click **Continue**.
5. Cloudflare will scan and display your current DNS records. Click **Continue**.

---

### Step 2: Change Nameservers at Domain Registrar
Cloudflare will provide **two nameservers**, for example:
- `ns1.cloudflare.com`
- `ns2.cloudflare.com`

1. Go to your domain registrar (GoDaddy, Namecheap, Hostinger, Google Domains/Squarespace, etc.).
2. Navigate to **DNS Management** > **Nameservers**.
3. Choose **Custom Nameservers** and replace the existing nameservers with the two Cloudflare nameservers.
4. Save changes (propagation takes 5 to 30 minutes).

---

### Step 3: Configure Cloudflare DNS Records
In your Cloudflare Dashboard under your domain:
1. Navigate to **DNS** > **Records**.
2. Click **Add Record**:

| Type | Name | IPv4 Address / Target | Proxy Status | TTL |
| :---: | :---: | :---: | :---: | :---: |
| **A** | `@` (root) | `<YOUR_AWS_EC2_PUBLIC_IP>` | **Proxied** (Orange cloud) | Auto |
| **CNAME** | `www` | `@` | **Proxied** (Orange cloud) | Auto |

> [!TIP]
> The **Orange Cloud (Proxied)** ensures all web traffic routes through Cloudflare's edge network, masking your EC2 IP address from attackers and providing free automatic SSL/TLS encryption.

---

### Step 4: Configure SSL/TLS Mode in Cloudflare
1. In Cloudflare, go to **SSL/TLS** > **Overview**.
2. Select **Flexible** (or **Full** if Nginx reverse proxy with self-signed certificate is installed on EC2).
   - *Flexible mode*: Encrypts traffic between visitors and Cloudflare with a trusted HTTPS certificate without needing to install an SSL certificate on the EC2 instance.
3. Under **SSL/TLS** > **Edge Certificates**:
   - Turn **ON** **Always Use HTTPS** (automatically redirects all `http://` traffic to `https://`).
   - Turn **ON** **Automatic HTTPS Rewrites**.

---

### Step 5: Port Routing (Optional - Direct Port 80/443 mapping)
If your EC2 runs the container on port `8080`, you can route port `80` to `8080` on EC2 using `iptables` or an Nginx reverse proxy:
```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```
Or in Cloudflare Dashboard: **Rules** > **Origin Rules** > Set destination port to `8080`.

---

### Step 6: Verify Deployment
Visit your custom domain in your browser:
👉 **`https://yourname.com/`**
- Verified SSL Padlock 🔒 in browser address bar.
- Global CDN caching and DDoS protection active.
