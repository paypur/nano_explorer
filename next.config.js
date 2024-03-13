/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 120,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
