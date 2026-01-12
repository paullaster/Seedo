import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    allowedOrigins: [
      "localhost:3000",
      "9b3faeff94a2.ngrok-free.app"
    ],
  },
};

export default nextConfig;
