/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hostaway-platform.s3.us-west-2.amazonaws.com",
        pathname: "/listing/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.holidayfuture.com' },
    ],
  },
  // Required for better-sqlite3 native module in Next.js 15
  serverExternalPackages: ['better-sqlite3'],
  // Allow serving uploaded images from /public/uploads
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
      },
    ];
  },
};

module.exports = nextConfig;
