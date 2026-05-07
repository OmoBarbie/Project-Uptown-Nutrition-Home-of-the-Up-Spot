import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: false, // Disabled temporarily due to route group type issues
  reactCompiler: true,
  turbopack: {},
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['@heroicons/react', '@headlessui/react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@tayo/components', '@tayo/database', '@tayo/email'],
}

export default nextConfig
