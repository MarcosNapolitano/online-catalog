import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    useCache: true,
  },
  images: {
    domains: ["raw.githubusercontent.com"]
  },
};

export default nextConfig;
