import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/blogyangu",
  assetPrefix: "/blogyangu",
  trailingSlash: true, // ensures URLs end with a slash
};

export default nextConfig;
