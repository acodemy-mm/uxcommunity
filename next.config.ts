import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use current working directory as project root (avoids multi-lockfile warning in CI)
  turbopack: { root: process.cwd() },
};

export default nextConfig;
