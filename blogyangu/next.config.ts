import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/blogyangu',
  assetPrefix: '/blogyangu',
  trailingSlash: true, // ensures URLs end with a slash
  // Temporarily disable font optimization to bypass network issues
  optimizeFonts: false,
};

export default nextConfig;
  
