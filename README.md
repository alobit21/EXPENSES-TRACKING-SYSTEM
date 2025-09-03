# 🚀 Deploying NestJS + PostgreSQL on AWS EC2 with PM2 and Nginx

This document explains the **full end-to-end process** of deploying a NestJS + PostgreSQL application (`pesayangu`) on an **AWS EC2 Ubuntu server**, managing it with **PM2**, and serving it with **Nginx**.

 

## ✅ Prerequisites
- AWS EC2 instance running Ubuntu 20.04+  
- Security group allowing ports **22 (SSH)**, **80 (HTTP)**, and **443 (HTTPS if using SSL)**  
- SSH access to the EC2 instance  
- Basic familiarity with terminal commands  

 

## 🛠️ Step-by-Step Deployment

### 1. Connect to EC2
```bash
# Connect to your EC2 instance
ssh -i my-key.pem ubuntu@my-ec2-public-ip
```
 

### 2. Update System
```bash
# Update and upgrade system packages
sudo apt update && sudo apt upgrade -y
```
 

### 3. Install Node.js & npm
```bash
# Add Node.js v18 repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and essential build tools
sudo apt install -y nodejs build-essential

# Verify installation
node -v
npm -v
```
 

### 4. Install PostgreSQL and Create Database
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Switch to postgres user
sudo -i -u postgres
psql
```

Inside PostgreSQL shell:
```sql
-- Create application database
CREATE DATABASE pesayangu;

-- Reset password for postgres user
ALTER USER postgres WITH PASSWORD 'postgres';

-- Exit
\q
```

Test connection:
```bash
psql -U postgres -W -d pesayangu
```


### 5. Clone and Configure NestJS App
```bash
# Clone your repo
git clone https://github.com/your-repo/EXPENSES-TRACKING-SYSTEM.git

# Move into project directory
cd EXPENSES-TRACKING-SYSTEM

# Install dependencies
npm install
```

Create `.env` file in the project root:
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pesayangu
```

Build the app:
```bash
npm run build
```
 

### 6. Run App with PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app with PM2
pm2 start npm --name "pesayangu-app" -- run start:prod

# Check status and logs
pm2 status
pm2 logs pesayangu-app

# Enable PM2 startup on reboot
pm2 startup systemd
pm2 save
```

 

### 7. Configure Nginx as Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx -y

# Create a new Nginx site config
sudo nano /etc/nginx/sites-available/pesayangu
```

Add the following:
```nginx
server {
    listen 80;
    server_name your_domain_or_public_ip;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/pesayangu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Configure Firewall / Security Group
For EC2 Security Group → allow:
- **Port 22 (SSH)**  
- **Port 80 (HTTP)**  
- **Port 443 (HTTPS)**  

For UFW firewall:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 9. Access the App
- Visit: `http://your-ec2-public-ip` or `http://your-domain.com`  
- Your NestJS app should now be live 🎉  



 

 

## 📖 To sumarize what have been done
- ✅ Connected to EC2 and updated system  
- ✅ Installed Node.js, npm, and PostgreSQL  
- ✅ Created database `pesayangu` and configured credentials  
- ✅ Cloned and built NestJS app  
- ✅ Managed app with PM2  
- ✅ Configured Nginx reverse proxy  
- ✅ Enabled firewall rules  
- ✅ App live on browser (HTTP/HTTPS)  
