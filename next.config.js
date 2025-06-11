/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Enable static exports for better deployment options
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig