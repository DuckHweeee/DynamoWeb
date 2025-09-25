import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Enable image optimization for Docker
  images: {
    unoptimized: false,
  },
  // Configure API routes for Docker environment
  async rewrites() {
    return [
      // Add any API rewrites if needed
    ];
  },
};

export default nextConfig;
