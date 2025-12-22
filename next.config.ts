import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [new URL("https://drive.google.com/file/d/**")],
    domains: ["https://raw.githubusercontent.com"]
  },
};

if (process.env.NODE_ENV === "production")
  nextConfig.basePath =
    "https://raw.githubusercontent.com/MarcosNapolitano/online-catalog/refs/heads/main"

export default nextConfig;
