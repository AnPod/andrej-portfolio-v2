import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  output: 'export',
  distDir: 'dist',
};

export default nextConfig;
