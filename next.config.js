/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize build tracing
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Exclude problematic paths from build tracing
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'node_modules/webpack',
    ],
  },
  // Disable output file tracing for problematic packages
  output: 'standalone',
}

module.exports = nextConfig


