import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/blogyangu",
  assetPrefix: "/blogyangu",
  trailingSlash: false, // disabled to fix API routing issues
};
export default nextConfig;