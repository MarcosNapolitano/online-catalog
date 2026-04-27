import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
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
        hostname: '**'
      },
    ]
  }
};
export default nextConfig;
