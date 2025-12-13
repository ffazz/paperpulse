# Docker Setup Guide untuk PaperPulse

## 📦 Struktur Docker

Proyek ini menggunakan Docker dengan konfigurasi berikut:

```
- Dockerfile          : Multi-stage build untuk Next.js
- docker-compose.yml  : Orchestration untuk app + PostgreSQL + pgAdmin
- .dockerignore       : File yang diabaikan saat build
- .env.docker         : Template environment variables
- docker-setup.sh     : Helper script untuk manage containers
```

## 🚀 Quick Start

### 1. **Persiapan**

```bash
# Copy template environment
cp .env.docker .env.docker.local

# Edit konfigurasi jika diperlukan
nano .env.docker.local
```

### 2. **Mulai dengan Script Helper**

```bash
# Buat executable
chmod +x docker-setup.sh

# Check Docker installation
./docker-setup.sh check

# Build dan start semua services
./docker-setup.sh start
```

### 3. **Akses Aplikasi**

- **App**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: `admin@paperpulse.local`
  - Password: `admin`
- **Database**: `localhost:5432`
  - User: `neondb_owner`
  - Password: `postgres`
  - Database: `neondb`

---

## 📋 Available Commands

```bash
# Check Docker & Docker Compose
./docker-setup.sh check

# Build images
./docker-setup.sh build

# Start all services (build jika belum ada)
./docker-setup.sh start

# Stop all services
./docker-setup.sh stop

# Restart services
./docker-setup.sh restart

# View live logs
./docker-setup.sh logs

# Open shell in app container
./docker-setup.sh shell

# Run Prisma migrations
./docker-setup.sh migrate

# Seed database
./docker-setup.sh seed

# Cleanup everything
./docker-setup.sh clean

# Show help
./docker-setup.sh help
```

---

## 🐳 Manual Docker Commands

Jika lebih suka langsung gunakan docker-compose:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run command in container
docker-compose exec app npx prisma migrate deploy

# Stop services
docker-compose down

# Remove everything (termasuk volumes)
docker-compose down -v
```

---

## 🔧 Konfigurasi Environment

### File: `.env.docker`

```dotenv
# Database
DB_USER=neondb_owner
DB_PASSWORD=postgres
DB_NAME=neondb

# NextAuth
NEXTAUTH_SECRET=your-secret-key

# pgAdmin (dev only)
PGADMIN_PASSWORD=admin
```

### Override di Runtime

```bash
# Gunakan dengan -e flag
docker-compose -e DB_PASSWORD=mypassword up -d

# Atau gunakan file khusus
docker-compose --env-file .env.docker.local up -d
```

---

## 🗄️ Database Management

### Jalankan Migrations

```bash
# Dari host
docker-compose exec app npx prisma migrate deploy

# Atau gunakan script
./docker-setup.sh migrate
```

### Seed Data

```bash
# Gunakan script
./docker-setup.sh seed

# Atau manual
docker-compose exec app npx prisma db seed
```

### Akses PostgreSQL Langsung

```bash
# Via psql (jika terinstall)
psql -h localhost -U neondb_owner -d neondb

# Via container
docker-compose exec postgres psql -U neondb_owner -d neondb
```

### Gunakan pgAdmin

1. Buka http://localhost:5050
2. Login: `admin@paperpulse.local` / `admin`
3. Add new server:
   - Host: `postgres`
   - Port: `5432`
   - Username: `neondb_owner`
   - Password: `postgres`

---

## 🐛 Troubleshooting

### Port sudah terpakai

```bash
# Check yang menggunakan port
lsof -i :3000
lsof -i :5432

# Gunakan port berbeda
docker-compose up -d -e "APP_PORT=3001"
```

### Database connection error

```bash
# Check logs
docker-compose logs postgres

# Verify database ready
docker-compose exec postgres pg_isready -U neondb_owner

# Restart database
docker-compose restart postgres
```

### Migrations failed

```bash
# Check Prisma status
docker-compose exec app npx prisma migrate status

# Reset database (hapus semua data!)
docker-compose exec app npx prisma migrate reset

# Generate Prisma Client
docker-compose exec app npx prisma generate
```

### Memory issues

Tambah memory limit di `docker-compose.yml`:

```yaml
app:
  ...
  deploy:
    resources:
      limits:
        memory: 2G
      reservations:
        memory: 1G
```

---

## 📊 Health Checks

Container app memiliki health check otomatis:

```bash
# Check status
docker-compose ps

# Output:
# NAME                COMMAND                  SERVICE     STATUS
# paperpulse-app      "dumb-init -- node..."   app         Up (healthy)
# paperpulse-db       "docker-entrypoint..."   postgres    Up (healthy)
```

---

## 🔐 Security Notes

- **Non-root user**: App berjalan sebagai user `nextjs` (UID 1001)
- **Health checks**: Container di-restart jika tidak healthy
- **Signal handling**: dumb-init menangani signals dengan proper
- **Secrets**: Jangan commit `.env.docker.local` ke git
- **Database password**: Ganti password default di production

---

## 📦 Production Deployment

### Build Production Image

```bash
# Build dengan tag
docker build -t paperpulse:latest .

# Push ke registry
docker tag paperpulse:latest your-registry/paperpulse:latest
docker push your-registry/paperpulse:latest
```

### Docker-compose untuk Production

Buat `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    image: your-registry/paperpulse:latest
    restart: always
    environment:
      NODE_ENV: production
      NEXTAUTH_URL: https://paperpulse.com
      DATABASE_URL: postgresql://...
    ports:
      - "3000:3000"
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: '1'
          memory: 2G
```

Jalankan dengan:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧹 Cleanup

### Remove containers
```bash
docker-compose down
```

### Remove containers + volumes
```bash
docker-compose down -v
```

### Remove images
```bash
docker-compose down -v --rmi all
```

### Full cleanup (containers, volumes, images, networks)
```bash
./docker-setup.sh clean
```

---

## 📚 Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

---

## ✅ Checklist sebelum Production

- [ ] Update NEXTAUTH_SECRET dengan nilai yang aman
- [ ] Gunakan managed database (bukan PostgreSQL container)
- [ ] Setup environment variables dengan secrets manager
- [ ] Configure reverse proxy (Nginx/Traefik)
- [ ] Setup SSL/TLS certificates
- [ ] Configure backups untuk database
- [ ] Setup monitoring dan logging
- [ ] Test disaster recovery
- [ ] Document deployment process
