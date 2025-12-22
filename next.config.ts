import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    domains: ["raw.githubusercontent.com"]
  },
};

export default nextConfig;
