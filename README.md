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
ssh -i "manualconfig.pem" ubuntu@ec2-51-21-246-100.eu-north-1.compute.amazonaws.com  #was my key


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






## CREATING DATABASE BACKUP AFTER EACH THREE HOURS 


PostgreSQL Automated Backup Script Setup on Ubuntu EC2
This  explains how to set up an automated PostgreSQL database backup system that runs every 3 hours, compresses backups, logs activity, and deletes old backups after 7 days.
1. Create Backup Directory
Choose a directory where backups will be stored and that the script user can write to. For this setup, we use /opt/db_backups.

```bash
sudo mkdir -p /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups
sudo chown postgres:postgres /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups
sudo chmod 755 /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups
```
- `chown postgres:postgres` ensures the `postgres` user can write files.
- `chmod 755` allows read/execute for everyone and write for the owner.
2. Create the Backup Script


## 1. Create a scripts folder:
```bash
sudo mkdir -p /opt/scripts
```
## 2. Create the script file:
```bash
sudo nano /opt/scripts/db_backup.sh
```
## 3. Paste the following content:
```bash
#!/bin/bash

# === CONFIGURATION ===
DB_NAME="pesayangu"
DB_USER="postgres"
DB_PASS="postgres"
BACKUP_DIR="/home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILE_NAME="${DB_NAME}_backup_${DATE}.sql"

export PGPASSWORD=$DB_PASS
mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_DIR/$FILE_NAME
gzip $BACKUP_DIR/$FILE_NAME
cd $BACKUP_DIR || exit
find . -type f -mtime +7 -name "*.gz" -delete
echo "[$(date)] Backup completed: $BACKUP_DIR/${FILE_NAME}.gz" >> $BACKUP_DIR/backup.log
```
## 3. Make the Script Executable
```bash
sudo chmod 755 /opt/scripts/db_backup.sh
```
- `755` allows the owner to read/write/execute and everyone else to read/execute.
## 4. Test the Script Manually
Run the script as the `postgres` user:
```bash
sudo -u postgres /opt/scripts/db_backup.sh
```
Check the backup folder:
```bash
ls -lh /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups
```- You should see the compressed `.sql.gz` file(s) and `backup.log`.
5. Set Up Cron for Automatic Backups
1. Edit the cron jobs for the user:
```bash
crontab -e
```
## 2. Add the following line to run the script every 3 hours:
```cron
0 */3 * * * /opt/scripts/db_backup.sh >> /opt/db_backups/cron.log 2>&1
```
- `0 */3 * * *` → runs at minute 0 every 3 hours.
- `>> /opt/db_backups/cron.log 2>&1` → captures output and errors for review.
## 3. Save and exit. Verify cron job:
```bash
crontab -l
```
## 4. Verify Backups and Logs
- Backup files: `/opt/db_backups/pesayangu_backup_YYYY-MM-DD_HH-MM-SS.sql.gz`
- Script log: `/opt/db_backups/backup.log`
- Cron log: `/opt/db_backups/cron.log`

Check recent backups:
```bash
ls -lh /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups
tail -n 10 /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups/backup.log
tail -n 20 /home/ubuntu/EXPENSES-TRACKING-SYSTEM/db_backups/cron.log
```
 
## To summarize
- Backups run every 3 hours automatically.
- Backups are compressed to save space.
- Backups older than 7 days are automatically deleted.
- Logs record successful backups (`backup.log`) and cron activity (`cron.log`).
- Script can be run manually or automatically via cron.




## CREATING A SCRIPT FOR AUTOMATIC RUN-UP AN APPLICATION WHEN THE SERVER(EC2) GOES DOWN





SCRIPT FOR AUTOMATIC RUN UP APPLICATION


#!/bin/bash

# === CONFIGURATION ===
APP_NAME="pesayangu-app"
LOG_DIR="/opt/monitoring_logs"
LOG_FILE="$LOG_DIR/monitor_log.txt"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
ALERT_EMAIL="macapp5363@gmail.com"

# Gmail credentials
GMAIL_USER="your-gmail@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Thresholds
CPU_THRESHOLD=80 # in %
MEM_THRESHOLD=80 # in %
DISK_THRESHOLD=80 # in %

# Ensure log directory exists
mkdir -p $LOG_DIR

# Function to send email via Gmail SMTP
send_email() {
local subject="$1"
local body="$2"
email_content=$(cat << EOF
From: $GMAIL_USER
To: $ALERT_EMAIL
Subject: $subject

$body

This is an automated message from your server monitoring script.
EOF
)
curl -s --url 'smtps://smtp.gmail.com:465' \
--ssl-reqd \
--mail-from "$GMAIL_USER" \
--mail-rcpt "$ALERT_EMAIL" \
--user "$GMAIL_USER:$GMAIL_APP_PASSWORD" \
-T <(echo "$email_content") > /dev/null 2>&1

if [ $? -eq 0 ]; then
echo "[$DATE] Email sent successfully: $subject" >> $LOG_FILE
else
echo "[$DATE] Failed to send email: $subject" >> $LOG_FILE
fi
}

# === START LOG SECTION ===
{
echo "========================================="
echo "Health Check Run: $DATE"
echo "-----------------------------------------"

# Disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
echo "Disk Usage: $DISK_USAGE%"
if [ "$DISK_USAGE" -ge "$DISK_THRESHOLD" ]; then
send_email "🚨 ALERT: High Disk Usage" "Disk usage is at ${DISK_USAGE}% on $(hostname) at $DATE"
fi
echo "-----------------------------------------"

# CPU usage
CPU_LOAD=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2 + $4)}')
echo "CPU Load: $CPU_LOAD%"
if [ "$CPU_LOAD" -ge "$CPU_THRESHOLD" ]; then
send_email "🚨 ALERT: High CPU Usage" "CPU load is at ${CPU_LOAD}% on $(hostname) at $DATE"
fi
echo "-----------------------------------------"

# Memory usage
MEM_USAGE=$(free | awk '/Mem:/ {print int($3/$2 * 100)}')
echo "Memory Usage: $MEM_USAGE%"
if [ "$MEM_USAGE" -ge "$MEM_THRESHOLD" ]; then
send_email "🚨 ALERT: High Memory Usage" "Memory usage is at ${MEM_USAGE}% on $(hostname) at $DATE"
fi
echo "-----------------------------------------"

# Check app status
echo "Application Status:"
if pm2 show $APP_NAME > /dev/null 2>&1; then
STATUS=$(pm2 status $APP_NAME | grep $APP_NAME | awk '{print $10}')
echo "PM2 reports status: $STATUS"

if [ "$STATUS" != "online" ]; then
echo "App is DOWN. Restarting..."
pm2 restart $APP_NAME
echo "App restarted at: $(date)"
send_email "🚨 ALERT: $APP_NAME restarted" "[$DATE] ALERT: $APP_NAME was DOWN and restarted on $(hostname)"
else
echo "App is running normally."
fi
else
echo "App not found in PM2. Starting..."
pm2 start npm --name "$APP_NAME" -- run start:prod
echo "App started at: $(date)"
send_email "🚨 ALERT: $APP_NAME started" "[$DATE] ALERT: $APP_NAME was not running and has been started on $(hostname)"
fi

echo "Health check finished at: $(date)"
echo "========================================="
echo ""

} >> $LOG_FILE 2>&1





##  AUTOMATIC MONITORING AND DEPLOYMENT FOR NESTJS ON AWS EC2 

1. Overview
This document details the full setup of automated monitoring and deployment scripts for a NestJS application (pesayangu) deployed on an Ubuntu EC2 instance. These scripts ensure the application stays up-to-date, running, and healthy, while maintaining logs and sending email alerts.
Scripts: - Monitoring Script: Checks app health, system resources, restarts the app if down, and sends email alerts. - Auto-Pull & Deploy Script: Automatically pulls GitHub changes, rebuilds the app, restarts PM2, logs activities, and sends email alerts.

2. Prerequisites
    • Ubuntu 20.04+ EC2 instance
    • NestJS application deployed and running under PM2
    • Node.js & npm installed
    • Git installed
    • Gmail account with App Password configured for sending emails
    • SSH access to EC2 instance

3. Monitoring Script Setup
Script Location
/opt/scripts/monitor_app.sh
Features
    1. Checks PM2 application health.
    2. Monitors CPU, memory, and disk usage.
    3. Restarts the app if down.
    4. Sends email alerts.
    5. Logs all activity every 3 hours in /opt/monitoring_logs/monitor_log.txt.
Script Content
#!/bin/bash

APP_NAME="pesayangu-app"
LOG_DIR="/opt/monitoring_logs"
LOG_FILE="$LOG_DIR/monitor_log.txt"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
ALERT_EMAIL="macapp5363@gmail.com"

mkdir -p $LOG_DIR

{
echo "========================================="
echo "Health Check Run: $DATE"
echo "-----------------------------------------"

# Disk usage
echo "Disk Usage:"
df -h /
echo "-----------------------------------------"

# CPU usage
echo "CPU Load:"
uptime
echo "-----------------------------------------"

# Memory usage
echo "Memory Usage:"
free -m
echo "-----------------------------------------"

# Application status
echo "Application Status:"
if pm2 show $APP_NAME > /dev/null 2>&1; then
    STATUS=$(pm2 status $APP_NAME | grep $APP_NAME | awk '{print $10}')
    echo "PM2 reports status: $STATUS"

    if [ "$STATUS" != "online" ]; then
        echo "App is DOWN. Restarting..."
        pm2 restart $APP_NAME
        echo "App restarted at: $(date)"
        echo "[$DATE] ALERT: $APP_NAME was DOWN and restarted!" | mail -s "🚨 ALERT: $APP_NAME restarted" $ALERT_EMAIL
    else
        echo "App is running normally."
    fi
else
    echo "App not found in PM2. Starting..."
    pm2 start npm --name "$APP_NAME" -- run start:prod
    echo "App started at: $(date)"
    echo "[$DATE] ALERT: $APP_NAME started" | mail -s "🚨 ALERT: $APP_NAME started" $ALERT_EMAIL
fi

echo "Health check finished at: $(date)"
echo "========================================="
echo ""
} >> $LOG_FILE 2>&1
Cron Setup
0 */3 * * * /bin/bash /opt/scripts/monitor_app.sh
Testing
sudo -u ubuntu /bin/bash /opt/scripts/monitor_app.sh
tail -f /opt/monitoring_logs/monitor_log.txt

4. Auto-Pull & Deploy Script Setup
Script Location
/opt/scripts/auto_pull_deploy.sh
Features
    1. Checks GitHub repository for changes.
    2. Pulls changes automatically.
    3. Rebuilds the NestJS app.
    4. Restarts PM2 process.
    5. Sends email alerts.
    6. Logs activity every 3 hours in /home/ubuntu/deploy_logs/.
Script Content
#!/bin/bash

APP_NAME="pesayangu-app"
REPO_DIR="/home/ubuntu/EXPENSES-TRACKING-SYSTEM"
LOG_DIR="/home/ubuntu/deploy_logs"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
ALERT_EMAIL="macapp5363@gmail.com"

mkdir -p $LOG_DIR
LOG_FILE="$LOG_DIR/deploy_${DATE}.txt"

{
echo "========================================="
echo "Deployment Run: $DATE"
echo "-----------------------------------------"
cd $REPO_DIR

git fetch origin
CHANGES=$(git log HEAD..origin/main --oneline)
if [ -n "$CHANGES" ]; then
    echo "New changes detected. Pulling updates..."
    git pull origin main
    npm install
    npm run build
    pm2 restart $APP_NAME
    echo "Deployment successful at: $(date)"
    echo "[$DATE] ALERT: $APP_NAME updated and restarted" | mail -s "🚀 $APP_NAME Deployment" $ALERT_EMAIL
else
    echo "No changes detected. Skipping deployment."
fi

echo "Deployment finished at: $(date)"
echo "========================================="
echo ""
} >> $LOG_FILE 2>&1
Cron Setup
0 */3 * * * /bin/bash /opt/scripts/auto_pull_deploy.sh
Testing
sudo -u ubuntu /bin/bash /opt/scripts/auto_pull_deploy.sh
tail -f /home/ubuntu/deploy_logs/deploy_$(date +"%Y-%m-%d")_*.txt

5. Best Practices
    • Run scripts as the ubuntu user.
    • Use absolute paths.
    • PM2 processes must have proper ownership.
    • Keep Gmail App Password secure.
    • Separate logs per 3-hour interval.
    • Clean old logs periodically if needed.


# 🚀 Frontend Deployment Guide

## 1. Dockerizing the Frontend

Create a `Dockerfile` inside your frontend project (e.g., `ExpensesTS/`):

```dockerfile
# Stage 1: Build the app
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files and build
COPY . .
RUN npm run build

# Stage 2: Serve static files
FROM node:20-slim
WORKDIR /app
RUN npm install -g serve

# Copy built dist folder from build stage
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
```

👉 This multi-stage build ensures the final image is small, serving only static assets with the `serve` package.

---

## 2. Configuring `docker-compose.yaml`

Update your `docker-compose.yaml` to include both the **frontend** and **nginx** services:

```yaml
frontend:
  build:
    context: ./ExpensesTS
    dockerfile: Dockerfile
  image: codewithmac/expenses-frontend:latest
  container_name: frontend
  depends_on:
    - backend
  networks:
    - expenses_net

nginx:
  image: nginx:alpine
  container_name: expenses_nginx
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./ExpensesTS/dist:/usr/share/nginx/html:ro
    - /etc/letsencrypt/live/expenses.seranise.co.tz:/etc/letsencrypt/live/expenses.seranise.co.tz:ro
    - /etc/letsencrypt/archive/expenses.seranise.co.tz:/etc/letsencrypt/archive/expenses.seranise.co.tz:ro
  depends_on:
    - frontend
    - backend
  networks:
    - expenses_net
```

👉 Here:
- `frontend` builds the React/Vue/TS app.  
- `nginx` proxies traffic, serves static assets, and handles SSL termination.  

---

## 3. Securing the Domain with SSL (Let’s Encrypt)

Install Certbot and generate certificates:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d expenses.seranise.co.tz
```

Test auto-renewal:

```bash
sudo certbot renew --dry-run
```

🔐 After setup, your app will be available at:  
👉 https://expenses.seranise.co.tz  

### Recommended Security Headers (add to `nginx.conf`):

```nginx
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 4. SSL Certificate Expiration Alerts

To avoid unexpected downtime, create a script that reminds you **5 days before expiration**.

### Example Script: `cert_reminder_test_email.sh`

```bash
#!/bin/bash

# CONFIGURATION
DOMAIN="expenses.seranise.co.tz"
EMAIL="macapp5363@gmail.com"
CERT_FILE="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Get certificate expiration date
EXPIRY_DATE=$(sudo openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
DAYS_LEFT=$(( ( $(date -d "$EXPIRY_DATE" +%s) - $(date +%s) ) / 86400 ))

# Test mode: Always send an email
SUBJECT="Test SSL Certificate Reminder for $DOMAIN"
BODY="This is a test message from your SSL certificate reminder script.
Certificate expires in $DAYS_LEFT days on $EXPIRY_DATE."

echo -e "$BODY" | mail -s "$SUBJECT" "$EMAIL"

echo "Test email sent to $EMAIL"
```

---

## 5. Automating with Cron

For **testing** (every minute):

```bash
sudo crontab -e
```

Add:

```cron
* * * * * /usr/local/bin/cert_reminder_test_email.sh
```

For **production** (check once daily at 9 AM):

```cron
0 9 * * * /usr/local/bin/cert_reminder.sh
```

---

✅ With this setup:  
- Frontend is containerized and served via `nginx`.  
- Domain is secured with Let’s Encrypt.  
- You’ll be notified before your SSL certificate expires.  