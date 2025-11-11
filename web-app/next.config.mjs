/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore pino-pretty warning - it's an optional dependency
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
      };
    }
    
    // Suppress the warning about pino-pretty
    config.ignoreWarnings = [
      { module: /node_modules\/pino\/lib\/tools\.js/ },
    ];
    
    return config;
  },
};

export default nextConfig;

