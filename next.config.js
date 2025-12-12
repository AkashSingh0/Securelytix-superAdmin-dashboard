/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Proxy workspace API requests to local backend to avoid CORS
      {
        source: '/api/proxy/workspaces/:path*',
        destination: 'http://localhost:8000/api/v1/workspaces/:path*',
      },
      {
        source: '/api/proxy/workspaces',
        destination: 'http://localhost:8000/api/v1/workspaces',
      },
    ]
  },
}

module.exports = nextConfig

