import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove output: 'standalone' for Vercel deployment
  // output: 'standalone', // Only use this for Docker deployments
  
  // Enable image optimization
  images: {
    unoptimized: false,
  },
  
  // Configure API routes if needed
  async rewrites() {
    return [
      // Add any API rewrites if needed
    ];
  },
};

export default nextConfig;
