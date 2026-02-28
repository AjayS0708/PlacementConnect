/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/dashboard', destination: '/job-notifications', permanent: true },
      { source: '/saved', destination: '/job-notifications/saved', permanent: true },
      { source: '/digest', destination: '/job-notifications/digest', permanent: true },
      { source: '/settings', destination: '/job-notifications/settings', permanent: true },
      { source: '/proof', destination: '/job-notifications/proof', permanent: true },
      { source: '/jt/07-test', destination: '/job-notifications/test', permanent: true },
      { source: '/jt/08-ship', destination: '/job-notifications/ship', permanent: true },
      { source: '/jt/09-proof', destination: '/job-notifications/proof', permanent: true },
    ]
  },
}

module.exports = nextConfig
