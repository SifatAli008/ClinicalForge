/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        process: false,
      };
    }
    
    // Handle Firebase and undici modules properly
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: ['last 2 versions', 'ie >= 11']
              }
            }]
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-methods'
          ]
        }
      }
    });
    
    // Exclude undici from client-side bundle completely
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
        'node:fs': false,
        'node:path': false,
        'node:url': false,
        'node:http': false,
        'node:https': false,
        'node:stream': false,
        'node:util': false,
        'node:buffer': false,
        'node:crypto': false,
        'node:os': false,
        'node:assert': false,
        'node:zlib': false,
        'node:net': false,
        'node:tls': false,
      };
    }
    
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = nextConfig 