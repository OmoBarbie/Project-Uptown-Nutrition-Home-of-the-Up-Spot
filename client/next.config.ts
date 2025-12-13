import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  transpilePackages: ["@tayo/components"],
};

export default nextConfig;
