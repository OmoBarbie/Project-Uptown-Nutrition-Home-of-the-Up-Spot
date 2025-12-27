import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: false, // Disabled temporarily due to route group type issues
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  transpilePackages: ["@tayo/components", "@tayo/database"],
};

export default nextConfig;
