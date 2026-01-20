# 📊 PaperPulse Full Stack (App + Observability)

Setup lengkap untuk menjalankan **PaperPulse** (Next.js) beserta stack monitoring **Prometheus** dan **Grafana** dalam Docker Compose.

## 🎯 Apa yang Disediakan

| Service | URL | Deskripsi |
|---------|-----|-----------|
| **PaperPulse** | http://localhost:3000 | Next.js Application (Production) |
| **Prometheus** | http://localhost:9090 | Metrics collection & storage |
| **Grafana** | http://localhost:3001 | Visualization & dashboards |
| **Node Exporter** | http://localhost:9100 | Host/container metrics |

## 📋 Prerequisites

1. **Docker Desktop** terinstall dan running
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Pastikan Docker daemon sudah berjalan

2. **Database PostgreSQL** sudah tersedia
   - `DATABASE_URL` sudah dikonfigurasi di `.env`
   - Database bisa diakses dari container (gunakan host yang reachable)

3. **File `.env`** sudah ada di root repo dengan konfigurasi:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/paperpulse"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret"
   ```

## 🚀 Quick Start

### Langkah 1: Jalankan Full Stack

```bash
# Masuk ke folder observability
cd observability

# Build dan jalankan semua services
docker compose up -d --build

# Lihat status containers
docker compose ps
```

### Langkah 2: Verifikasi Aplikasi

1. Buka **PaperPulse App**: http://localhost:3000
2. Verifikasi **Metrics Endpoint**: http://localhost:3000/api/metrics

### Langkah 3: Verifikasi Prometheus Target

1. Buka http://localhost:9090/targets
2. Cari job **paperpulse**
3. Pastikan State menunjukkan **UP** (hijau)

### Langkah 4: Akses Grafana

1. Buka http://localhost:3001
2. Login dengan credentials:
   - **Username:** `admin`
   - **Password:** `admin`
3. Buka **Dashboards → PaperPulse → PaperPulse Overview**

## 🛠️ Troubleshooting

### Melihat Logs

```bash
# Semua logs
docker compose logs -f

# Log PaperPulse saja
docker compose logs -f paperpulse

# Log Prometheus
docker compose logs -f prometheus

# Log Grafana
docker compose logs -f grafana
```

### Restart Services

```bash
# Restart semua
docker compose restart

# Restart PaperPulse saja
docker compose restart paperpulse

# Rebuild dan restart PaperPulse
docker compose up -d --build paperpulse
```

### Error Koneksi Database

Jika PaperPulse gagal connect ke database:

1. **Pastikan `DATABASE_URL` reachable dari container**
   - Jika PostgreSQL di host lokal, gunakan `host.docker.internal` bukan `localhost`
   ```env
   DATABASE_URL="postgresql://user:password@host.docker.internal:5432/paperpulse"
   ```

2. **Cek koneksi dari container**
   ```bash
   docker compose exec paperpulse sh
   # Di dalam container:
   wget -qO- http://host.docker.internal:5432 || echo "Cannot reach DB"
   ```

3. **Pastikan PostgreSQL menerima koneksi dari Docker network**
   - Edit `pg_hba.conf` untuk allow koneksi dari `172.0.0.0/8`

### Target paperpulse DOWN di Prometheus

```bash
# Cek apakah PaperPulse container running
docker compose ps paperpulse

# Cek health status
docker inspect paperpulse-app --format='{{.State.Health.Status}}'

# Cek logs untuk error
docker compose logs paperpulse | tail -50

# Test metrics endpoint dari dalam network
docker compose exec prometheus wget -qO- http://paperpulse:3000/api/metrics | head
```

### Reset Grafana Password

```bash
docker compose exec grafana grafana-cli admin reset-admin-password newpassword
```

### Container Tidak Mau Start

```bash
# Lihat error detail
docker compose logs paperpulse

# Rebuild dari awal
docker compose down
docker compose build --no-cache paperpulse
docker compose up -d
```

### EACCES: Permission Denied Error

Jika muncul error seperti:
```
EACCES: permission denied, mkdir '/app/.next/cache/images'
```

**Penyebab:** Container berjalan sebagai non-root user (`node`) tapi folder cache belum memiliki permission yang benar.

**Solusi:**

1. **Rebuild dengan clean:**
   ```bash
   cd observability
   docker compose down
   docker rmi paperpulse-paperpulse 2>/dev/null || true
   docker compose up -d --build
   ```

2. **Verifikasi ownership di dalam container:**
   ```bash
   docker compose exec paperpulse ls -la /app/.next/cache/
   # Output harus menunjukkan owner: node node
   ```

3. **Jika masih error, fallback ke unoptimized images:**
   Edit `next.config.ts`:
   ```ts
   images: {
     unoptimized: true,  // Disable image optimization
   },
   ```

4. **Nuclear option - rebuild dari scratch:**
   ```bash
   docker compose down -v --rmi all
   docker builder prune -f
   docker compose up -d --build
   ```

**Fix sudah diterapkan di Dockerfile:**
- Menggunakan built-in user `node` dari node:alpine
- Membuat semua cache directories: `images`, `fetch-cache`, `server`
- `chown -R node:node /app` untuk memastikan semua file accessible

## 🔍 Metric yang Tersedia

| Metric Name | Type | Description |
|------------|------|-------------|
| `app_info` | gauge | App version info |
| `app_uptime_seconds` | gauge | Application uptime |
| `app_requests_total` | counter | Total requests ke metrics endpoint |
| `http_requests_total` | counter | HTTP requests by route/method/status |
| `http_request_duration_seconds` | histogram | Request duration |
| `node_memory_usage_bytes` | gauge | Memory heap usage |
| `node_memory_total_bytes` | gauge | Memory heap total |

### Contoh Query PromQL

```promql
# Total requests
sum(http_requests_total)

# Request rate per second
rate(http_requests_total[5m])

# Memory usage in MB
node_memory_usage_bytes / 1024 / 1024

# Service health
up{job="paperpulse"}
```

## 🧹 Cleanup

```bash
# Stop semua services
docker compose down

# Stop dan hapus volumes (reset data)
docker compose down -v

# Hapus semua (termasuk images)
docker compose down -v --rmi all
```

## 📁 File Structure

```
paperpulse/
├── Dockerfile                      # Multi-stage build untuk Next.js
├── .env                            # Environment variables
└── observability/
    ├── compose.yaml                # Docker Compose (App + Monitoring)
    ├── README.md                   # Dokumentasi ini
    ├── prometheus/
    │   └── prometheus.yml          # Prometheus configuration
    └── grafana/
        └── provisioning/
            ├── datasources/
            │   └── prometheus.yml  # Auto-configure datasource
            └── dashboards/
                ├── dashboards.yml
                └── json/
                    └── paperpulse-overview.json
```

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

---

**Happy Monitoring! 🎉**
