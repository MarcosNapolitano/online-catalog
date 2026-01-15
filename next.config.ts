import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/marcosnapolitano/online-catalog/refs/heads/main/public/img/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        search: '',
      },
    ]
  }
};
export default nextConfig;
