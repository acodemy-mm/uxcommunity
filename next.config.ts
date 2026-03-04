import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed turbopack.root (process.cwd()) to avoid "Error evaluating Node.js code" in deploy
};

export default nextConfig;
