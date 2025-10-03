import { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // Base path configuration
  basePath: isProd ? basePath : '',
  assetPrefix: isProd ? basePath : '',
  trailingSlash: false,

  // Public runtime config
  publicRuntimeConfig: {
    basePath: isProd ? basePath : '',
    apiUrl: isProd
      ? `${process.env.APP_URL}/api`
      : 'http://localhost:3000/api',
  },

  // Rewrite rules
  async rewrites() {
    const rewrites = [
      // API routes
      {
        source: '/api/:path*',
        destination: `${basePath}/api/:path*`,
      },
      // Auth routes
      {
        source: '/auth/:path*',
        destination: `${basePath}/auth/:path*`,
      },
      // All other routes
      {
        source: '/:path*',
        destination: `${basePath}/:path*`,
      },
    ];

    if (!isProd) {
      // In development, proxy API requests to avoid CORS
      rewrites.unshift({
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      });
    }

    return rewrites;
  },

  // Production optimizations
  reactStrictMode: true,
  compress: isProd,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization
  images: {
    unoptimized: !isProd,
    domains: isProd ? ['expenses.seranise.co.tz'] : ['localhost'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;



