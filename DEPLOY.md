# Risager Application - Deployment Guide

This guide provides instructions for deploying the Risager family property booking system using Docker.

## Prerequisites

Before deploying, ensure your server has:

- **Docker Engine** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)
- **Minimum System Requirements:**
  - 2 GB RAM (4 GB recommended)
  - 10 GB free disk space
  - Linux, macOS, or Windows with Docker Desktop

### Installing Docker

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**macOS/Windows:**
Download and install Docker Desktop from: https://docs.docker.com/get-docker/

## Deployment Methods

### Method 1: Quick Deployment (Recommended)

1. **Extract the deployment package:**
   ```bash
   tar -xzf risager-docker-deploy.tar.gz
   cd risager-docker-deploy
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit the configuration (IMPORTANT: Change default passwords!)
   nano .env  # or vim .env, or notepad .env on Windows
   ```

3. **Deploy using the automated script:**

   **On Linux/Mac:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   **On Windows:**
   ```cmd
   deploy.bat
   ```

4. **Access the application:**
   - Application: http://localhost:5062
   - MinIO Console: http://localhost:9001

### Method 2: Manual Deployment

1. **Extract and navigate to the package:**
   ```bash
   tar -xzf risager-docker-deploy.tar.gz
   cd risager-docker-deploy
   ```

2. **Create and configure .env file:**
   ```bash
   cp .env.example .env
   nano .env
   ```

   **Required configuration changes:**
   ```env
   # Update these with strong passwords
   POSTGRES_PASSWORD=YourSecurePassword123!
   MINIO_ROOT_PASSWORD=YourSecurePassword456!

   # Optional: Change ports if needed
   APP_PORT=5062
   POSTGRES_PORT=5432
   MINIO_API_PORT=9000
   MINIO_CONSOLE_PORT=9001
   ```

3. **Pull Docker images:**
   ```bash
   docker compose pull
   ```

4. **Build and start services:**
   ```bash
   docker compose up -d --build
   ```

5. **Verify deployment:**
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

## Initial Setup

### 1. MinIO Bucket Configuration

After first deployment, create the storage bucket:

1. Access MinIO Console: http://localhost:9001
2. Login with credentials from .env:
   - Username: Value of `MINIO_ROOT_USER` (default: minioadmin)
   - Password: Value of `MINIO_ROOT_PASSWORD`
3. Navigate to "Buckets" → "Create Bucket"
4. Create bucket named: `risager` (or value from `MINIO_BUCKET_NAME` in .env)
5. Set bucket to "Public" access if you want direct file access

### 2. Database Initialization

The application will automatically:
- Create database tables on first startup
- Seed an admin user (check application logs for credentials)
- Apply all necessary migrations

### 3. First Login

Check the application logs for the initial admin credentials:
```bash
docker compose logs app | grep -i "admin"
```

## Common Operations

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f minio
```

### Restart Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart app
```

### Stop Services
```bash
# Stop all services (keeps data)
docker compose stop

# Stop and remove containers (keeps data)
docker compose down

# Stop and remove everything including volumes (DESTROYS DATA!)
docker compose down -v
```

### Update Application

1. Stop the application:
   ```bash
   docker compose down
   ```

2. Extract new deployment package in the same location (overwrite files)

3. Rebuild and start:
   ```bash
   docker compose up -d --build
   ```

### Backup Data

**Backup PostgreSQL database:**
```bash
docker compose exec postgres pg_dump -U postgres risager > backup_$(date +%Y%m%d).sql
```

**Backup MinIO data:**
```bash
docker compose exec minio mc mirror /data/risager /backup/minio
# Or copy the volume directly
docker run --rm -v risager_minio-data:/data -v $(pwd):/backup alpine tar czf /backup/minio-backup.tar.gz -C /data .
```

### Restore Data

**Restore PostgreSQL database:**
```bash
cat backup_20250110.sql | docker compose exec -T postgres psql -U postgres -d risager
```

**Restore MinIO data:**
```bash
docker run --rm -v risager_minio-data:/data -v $(pwd):/backup alpine tar xzf /backup/minio-backup.tar.gz -C /data
```

## Troubleshooting

### Service Won't Start

1. Check logs:
   ```bash
   docker compose logs app
   ```

2. Verify all required services are running:
   ```bash
   docker compose ps
   ```

3. Ensure ports are not in use:
   ```bash
   # Linux/Mac
   sudo netstat -tlnp | grep -E '5062|5432|9000|9001'

   # Windows
   netstat -ano | findstr "5062 5432 9000 9001"
   ```

### Database Connection Issues

1. Verify PostgreSQL is healthy:
   ```bash
   docker compose exec postgres pg_isready
   ```

2. Check connection string in .env matches PostgreSQL credentials

3. Restart the app service:
   ```bash
   docker compose restart app
   ```

### File Upload Issues

1. Verify MinIO is running:
   ```bash
   curl http://localhost:9000/minio/health/live
   ```

2. Check MinIO bucket exists and has correct name

3. Verify MinIO credentials in .env

### Port Conflicts

If default ports are in use, update .env:
```env
APP_PORT=8080           # Change from 5062
POSTGRES_PORT=5433      # Change from 5432
MINIO_API_PORT=9100     # Change from 9000
MINIO_CONSOLE_PORT=9101 # Change from 9001
```

Then restart:
```bash
docker compose down
docker compose up -d
```

## Production Considerations

### Security

1. **Change default passwords** in .env before deploying
2. **Use strong passwords** (minimum 16 characters, mixed case, numbers, symbols)
3. **Restrict network access** using firewall rules
4. **Enable HTTPS** using a reverse proxy (nginx, Caddy, Traefik)
5. **Regular backups** of database and file storage
6. **Keep Docker images updated** regularly

### Performance

1. **Allocate sufficient resources:**
   - Minimum 2 GB RAM, 4 GB recommended
   - Monitor with: `docker stats`

2. **PostgreSQL tuning:**
   Add to docker-compose.yml under postgres service:
   ```yaml
   command: postgres -c shared_buffers=256MB -c max_connections=100
   ```

3. **Enable persistent logging:**
   ```yaml
   services:
     app:
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"
   ```

### Reverse Proxy Setup (Optional)

For production, use nginx or Caddy as a reverse proxy:

**Example nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5062;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Monitoring

### Health Checks

All services have built-in health checks:
```bash
# Check service health
docker compose ps

# Manually check app health
curl http://localhost:5062/health
```

### Resource Usage

```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df
```

### Log Rotation

Logs are automatically rotated by Docker. To view:
```bash
# View logs with timestamps
docker compose logs -f --timestamps

# View last 100 lines
docker compose logs --tail=100
```

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Review this guide
- Check Docker documentation: https://docs.docker.com
- Verify environment configuration in .env

## Architecture Overview

The deployment consists of three services:

1. **PostgreSQL** (postgres:latest)
   - Database server
   - Port: 5432
   - Data: Persisted in `postgres-data` volume

2. **MinIO** (minio/minio)
   - S3-compatible object storage
   - API Port: 9000
   - Console Port: 9001
   - Data: Persisted in `minio-data` volume

3. **Application** (.NET 8 + Next.js)
   - Backend API + Frontend UI
   - Port: 5062
   - Includes authentication, booking system, and file management

All services communicate through a Docker bridge network (`risager-network`).
