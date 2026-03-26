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
      // Vercel Blob storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  // Allow serving uploaded images from /public/uploads (dev fallback)
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
