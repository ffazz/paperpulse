# Multi-stage build untuk optimasi ukuran image
FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL and build tools
RUN apk add --no-cache openssl openssl-dev

# Configure npm untuk timeout lebih lama dan retry
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 60000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies dengan retry
RUN npm ci || npm ci || npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install dumb-init dan OpenSSL untuk Prisma
RUN apk add --no-cache dumb-init openssl wget

# Copy dari builder (sebagai root dulu untuk setup permissions)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/

# Buat semua direktori cache yang dibutuhkan Next.js
# dan set ownership ke user node (built-in user di node:alpine)
RUN mkdir -p .next/cache/images \
    && mkdir -p .next/cache/fetch-cache \
    && mkdir -p .next/server \
    && chown -R node:node /app

# Switch ke non-root user (node adalah built-in user di node:alpine)
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init untuk PID 1
ENTRYPOINT ["dumb-init", "--"]

# Start app with Next.js server
CMD ["npm", "start"]
