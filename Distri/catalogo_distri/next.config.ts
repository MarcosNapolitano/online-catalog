import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images:{

        remotePatterns: [new URL("https://drive.google.com/file/d/**")],
  },
};

export default nextConfig;
