import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com',
      'img.clerk.com',
      'images.clerk.dev',
    ], // Add Cloudinary domain here
  },
};

export default nextConfig;
