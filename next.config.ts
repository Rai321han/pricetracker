import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://m.media-amazon.com/images/**")],
  },
  allowedDevOrigins: ["0cae-103-113-173-27.ngrok-free.app"],
};

export default nextConfig;
