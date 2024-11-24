import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Add a comment to trigger deployment
  /* Trigger new deployment */
};

export default nextConfig;
