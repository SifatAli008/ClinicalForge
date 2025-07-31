/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for development
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Fast Refresh configuration
  experimental: {
    // Enable Fast Refresh
    fastRefresh: true,
  },
  // Development-specific settings
  ...(process.env.NODE_ENV === 'development' && {
    // Disable some security headers in development to prevent COOP issues
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            // Remove Cross-Origin-Opener-Policy in development to fix Fast Refresh
            // {
            //   key: 'Cross-Origin-Opener-Policy',
            //   value: 'same-origin',
            // },
          ],
        },
      ];
    },
  }),
  // Production headers
  ...(process.env.NODE_ENV === 'production' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
          ],
        },
      ];
    },
  }),
};

module.exports = nextConfig; 