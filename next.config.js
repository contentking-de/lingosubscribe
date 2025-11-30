/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize build tracing
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Disable output file tracing to avoid stack overflow
  outputFileTracing: false,
}

module.exports = nextConfig


