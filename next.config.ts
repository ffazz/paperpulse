import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    // Untuk Docker production: gunakan unoptimized jika masih ada permission issues
    // unoptimized: process.env.DOCKER_BUILD === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Output standalone untuk Docker (optional, untuk smaller image)
  // output: 'standalone',
}

export default nextConfig
