import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [new URL("https://drive.google.com/file/d/**")],
  },
};

export default nextConfig;
