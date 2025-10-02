import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/blogyangu',
  assetPrefix: '/blogyangu',
};

   export default {
    trailingSlash: true, // ensures URLs end with a slash
  }
  
