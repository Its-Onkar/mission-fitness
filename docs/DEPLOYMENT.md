# Deployment Guide

This guide covers different deployment options for Mission Fitness.

## Prerequisites

- Docker and Docker Compose
- Node.js 16+ (for local development)
- MongoDB instance
- OpenAI API key
- Email service credentials

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
NODE_ENV=production
MONGO_URI=mongodb://mongo:27017/mission-fitness
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BASE_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## Docker Deployment

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Its-Onkar/mission-fitness.git
cd mission-fitness

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start with Docker Compose
docker-compose up -d
```

### Production Deployment

```bash
# Build production image
docker build -t mission-fitness:latest .

# Run with production compose file
docker-compose -f docker-compose.prod.yml up -d
```

## Manual Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/Its-Onkar/mission-fitness.git
cd mission-fitness

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
# Edit .env file with production values

# Create necessary directories
mkdir -p logs backups

# Set permissions
chmod +x scripts/*.sh
```

### 3. Process Management with PM2

```bash
# Install PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mission-fitness',
    script: 'start-server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx Configuration

### Install Nginx

```bash
sudo apt install nginx
```

### Configure Nginx

```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/mission-fitness

# Add the configuration from nginx/nginx.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/mission-fitness /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Setup

### MongoDB Configuration

```bash
# Connect to MongoDB
mongosh

# Create database and user
use mission-fitness
db.createUser({
  user: "missionfitness",
  pwd: "secure-password",
  roles: [{ role: "readWrite", db: "mission-fitness" }]
})

# Create indexes (run the mongo-init.js script)
load("scripts/mongo-init.js")
```

## Monitoring Setup

### Health Checks

```bash
# Add to crontab for health monitoring
*/5 * * * * curl -f http://localhost:5000/health || echo "Health check failed" | mail -s "Mission Fitness Down" admin@yourdomain.com
```

### Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/mission-fitness

# Add configuration:
/opt/mission-fitness/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 node node
    postrotate
        pm2 reload mission-fitness
    endscript
}
```

## Backup Strategy

### Automated Backups

```bash
# Add to crontab
0 2 * * * /opt/mission-fitness/scripts/backup.sh production
```

### Manual Backup

```bash
# Run backup script
./scripts/backup.sh production
```

## Deployment Script

Use the automated deployment script:

```bash
# Make executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh production
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **MongoDB connection issues**
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

3. **Permission issues**
   ```bash
   sudo chown -R node:node /opt/mission-fitness
   ```

4. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   # Restart application
   pm2 restart mission-fitness
   ```

### Logs

```bash
# Application logs
tail -f logs/app-$(date +%Y-%m-%d).log

# PM2 logs
pm2 logs mission-fitness

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### Node.js Optimization

```bash
# Set NODE_OPTIONS for production
export NODE_OPTIONS="--max-old-space-size=2048"
```

### Database Optimization

```javascript
// Add to MongoDB configuration
db.adminCommand({setParameter: 1, internalQueryExecMaxBlockingSortBytes: 335544320})
```

### Nginx Optimization

```nginx
# Add to nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    use epoll;
    multi_accept on;
}
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Access logs monitoring
- [ ] Rate limiting configured

## Scaling

### Horizontal Scaling

```bash
# Scale with Docker Swarm
docker swarm init
docker service create --replicas 3 --name mission-fitness mission-fitness:latest
```

### Load Balancing

```nginx
upstream mission_fitness {
    server app1:5000;
    server app2:5000;
    server app3:5000;
}
```

## Maintenance

### Regular Tasks

1. **Weekly**: Check logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Full backup verification and disaster recovery test

### Update Process

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run tests
npm test

# Deploy
./scripts/deploy.sh production
```