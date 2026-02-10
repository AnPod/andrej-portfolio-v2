import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  distDir: 'dist',
};

export default nextConfig;
