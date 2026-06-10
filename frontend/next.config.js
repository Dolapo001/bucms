/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        // Cloudinary — production media & sermon audio thumbnails
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // Render backend — fallback local media in production
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/media/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy all /api/* requests to the Django backend (dev: localhost, prod: Render)
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
