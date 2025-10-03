import { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,
  publicRuntimeConfig: {
    basePath,
  },
  async rewrites() {
    return [
      {
        source: `${basePath}/api/auth/:path*`,
        destination: `${basePath}/api/auth/:path*`,
      },
      {
        source: `${basePath}/:path*`,
        destination: `${basePath}/:path*`,
      },
    ];
  }
};