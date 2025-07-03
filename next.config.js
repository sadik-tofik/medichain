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
      '@meshsdk/core',
      '@emurgo/cardano-serialization-lib-browser',
      'bufferutil',
      'utf-8-validate',
    ],
    webpackBuildWorker: true,
    esmExternals: 'loose',
    serverActions: true,
  },
  // Remove the api config as it's not a valid top-level option
  // API body parser can be configured in your API routes directly
  
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

    // Add this only if you're using @emurgo/cardano-serialization-lib-browser
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@emurgo/cardano-serialization-lib-browser': require.resolve('@emurgo/cardano-serialization-lib-browser'),
      };
    }

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

// Export the config
module.exports = nextConfig;