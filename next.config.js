/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      '@neondatabase/serverless',
      'bufferutil',
      'utf-8-validate',
    ],
  },
  
  webpack: (config, { isServer }) => {
    // Handle WebAssembly files
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true,
      layers: true,
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      net: false,
      tls: false,
      buffer: require.resolve('buffer/'),
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
  output: 'standalone',
  swcMinify: true,
};

module.exports = nextConfig;