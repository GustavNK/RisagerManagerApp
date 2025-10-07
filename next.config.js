/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable export mode for production builds
  ...(process.env.NODE_ENV === 'production' && process.env.BUILD_MODE === 'export' && {
    output: 'export',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig