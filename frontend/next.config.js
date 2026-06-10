/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        // Local Django dev server
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        // Cloudinary — production sermon audio thumbnails & media
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // Vercel monorepo: backend media served at /_/backend/media/**
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/_/backend/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
