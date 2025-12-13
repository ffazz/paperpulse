# Docker Quick Start untuk PaperPulse

## ⚡ Quick Commands

```bash
# Production - Build & Start
make docker-up

# Development Database Only
make dev-db-up

# Lihat semua commands
make help
```

## 📦 Files yang ditambahkan

| File | Fungsi |
|------|--------|
| `Dockerfile` | Multi-stage build untuk production |
| `docker-compose.yml` | Production setup (app + PostgreSQL + pgAdmin) |
| `docker-compose.dev.yml` | Development setup (database only) |
| `.dockerignore` | Files yang diabaikan saat build |
| `.env.docker` | Template environment variables |
| `docker-setup.sh` | Helper script untuk manage containers |
| `Makefile` | Convenient make commands |
| `DOCKER_SETUP.md` | Complete documentation |

## 🚀 Langkah-langkah

### Development (Local)
1. **Start database saja:**
   ```bash
   make dev-db-up
   ```
   - PostgreSQL: `localhost:5432`
   - pgAdmin: `localhost:5050`

2. **Run app lokal dengan `npm run dev`:**
   ```bash
   npm run dev
   ```

### Production (Docker)
1. **Build & start semua services:**
   ```bash
   make docker-up
   ```
   - App: `localhost:3000`
   - pgAdmin: `localhost:5050`
   - Database: `localhost:5432`

2. **Run migrations:**
   ```bash
   make docker-migrate
   ```

3. **Seed database:**
   ```bash
   make docker-seed
   ```

## 🔧 Available Commands

```bash
# Check
make docker-check           # Verify Docker is installed

# Build & Deploy
make docker-build          # Build image
make docker-up             # Start all services
make docker-down           # Stop services
make docker-logs           # View logs
make docker-shell          # Access container shell
make docker-migrate        # Run migrations
make docker-seed           # Seed database
make docker-clean          # Remove everything

# Dev Database
make dev-db-up             # Start dev database
make dev-db-down           # Stop dev database
make dev-db-logs           # View database logs
```

## 🗄️ Database Access

### pgAdmin (GUI)
- URL: http://localhost:5050
- Email: admin@paperpulse.local
- Password: admin

### psql (CLI)
```bash
psql -h localhost -U neondb_owner -d neondb
```

## 📝 Environment Variables

Edit `.env.docker` untuk customize:
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `NEXTAUTH_SECRET`: JWT secret
- `NODE_ENV`: production/development

## ✅ Highlights

✅ Multi-stage Dockerfile (optimized for production)
✅ Non-root user untuk security
✅ Health checks included
✅ Signal handling with dumb-init
✅ Development & Production configs
✅ Automated GitHub Actions pipeline
✅ PostgreSQL + pgAdmin included
✅ Helper scripts & Makefile for convenience

## 📚 Dokumentasi Lengkap

Lihat `DOCKER_SETUP.md` untuk dokumentasi complete, troubleshooting, dan production deployment guidelines.

---

**Next Steps:**
1. ✅ Docker setup complete
2. → Test dengan dev database
3. → Deploy ke production
