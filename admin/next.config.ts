import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  turbopack: {},
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  transpilePackages: ["@tayo/components", "@tayo/database", "@tayo/email"],
};

export default nextConfig;
