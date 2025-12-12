# Production Deployment Guide

This guide explains how to deploy the RTDWMS application to production using Docker containers.

## Architecture

The production deployment consists of:
- **Frontend**: React application served via Nginx
- **Backend**: FastAPI application
- **Database**: PostgreSQL 16
- **Reverse Proxy**: Nginx with SSL/HTTPS support

## Prerequisites

1. **Docker** and **Docker Compose** installed
2. **Public IP**: 46.32.109.46 (already configured)
3. **Domain name** (optional, can use IP directly)
4. **Ports 80 and 443** open in firewall

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file:
```bash
cp env.production.example .env.production
```

Edit `.env.production` with your actual values:
- Change `POSTGRES_PASSWORD` to a secure password
- Update `EMAIL` for Let's Encrypt certificates
- Adjust `DOMAIN` if using a domain name instead of IP

### 2. Generate SSL Certificates

**Option A: Self-signed (for testing)**
```bash
chmod +x scripts/generate-ssl.sh
./scripts/generate-ssl.sh
```

**Option B: Let's Encrypt (for production)**

First, ensure ports 80 and 443 are accessible, then:
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d 46.32.109.46 --email your-email@example.com

# Copy certificates to project directory
sudo cp -r /etc/letsencrypt/live/46.32.109.46 ./certbot/conf/live/
sudo chown -R $USER:$USER ./certbot/conf
```

### 3. Deploy

Make the deployment script executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Build Docker images
- Start all containers
- Perform health checks
- Display service URLs

## Accessing the Application

After deployment:
- **Application**: https://46.32.109.46
- **API Documentation**: https://46.32.109.46/api/docs
- **Health Check**: https://46.32.109.46/health

## Updating the Application

To deploy a new version:

1. **Pull latest code** (if using git):
   ```bash
   git pull
   ```

2. **Rebuild and restart**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

   Or use the deploy script:
   ```bash
   ./deploy.sh
   ```

3. **Verify deployment**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   curl https://46.32.109.46/health
   ```

## Useful Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Service Management
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# View service status
docker-compose -f docker-compose.prod.yml ps
```

### Database Operations

**Backup database**:
```bash
chmod +x scripts/backup-db.sh
./scripts/backup-db.sh
```

**Restore database**:
```bash
chmod +x scripts/restore-db.sh
./scripts/restore-db.sh backups/rtdwms_backup_YYYYMMDD_HHMMSS.sql.gz
```

## Troubleshooting

### Port Already in Use
If ports 80 or 443 are already in use:
```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2  # or nginx, or other web server
```

### SSL Certificate Issues
- Ensure ports 80 and 443 are accessible from internet
- Check certificate paths in nginx configuration
- Verify certificate permissions: `ls -la certbot/conf/live/46.32.109.46/`

### Database Connection Issues
- Verify database container is running: `docker ps | grep rtdwms_db`
- Check database logs: `docker-compose -f docker-compose.prod.yml logs db`
- Verify DATABASE_URL in .env.production matches container name

### Frontend Not Loading
- Check nginx logs: `docker-compose -f docker-compose.prod.yml logs nginx`
- Verify frontend container is running
- Check browser console for errors

## Security Considerations

1. **Change default passwords** in `.env.production`
2. **Use Let's Encrypt** certificates for production (not self-signed)
3. **Keep Docker images updated**: `docker-compose -f docker-compose.prod.yml pull`
4. **Regular backups**: Schedule database backups
5. **Firewall**: Only expose ports 80 and 443
6. **Monitor logs**: Regularly check for suspicious activity

## Development vs Production

- **Development**: Use `docker-compose.yml` (database only) + local Python/Node
- **Production**: Use `docker-compose.prod.yml` (all services containerized)

## File Structure

```
.
├── docker-compose.yml              # Development (database only)
├── docker-compose.prod.yml         # Production (all services)
├── deploy.sh                       # Deployment script
├── env.production.example          # Environment template
├── .env.production                 # Production environment (not in git)
├── backend/
│   └── Dockerfile                  # Backend container
├── frontend/
│   ├── Dockerfile                  # Frontend container
│   └── nginx.conf                  # Frontend nginx config
├── nginx/
│   └── nginx.conf                  # Reverse proxy config
├── certbot/
│   ├── conf/                       # SSL certificates
│   └── www/                        # Let's Encrypt challenge
└── scripts/
    ├── generate-ssl.sh             # SSL certificate generation
    ├── backup-db.sh                # Database backup
    └── restore-db.sh               # Database restore
```

## Support

For issues or questions, check:
- Application logs: `docker-compose -f docker-compose.prod.yml logs`
- Service status: `docker-compose -f docker-compose.prod.yml ps`
- Health endpoint: `curl https://46.32.109.46/health`
