/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Konva/react-konva requires the 'canvas' package for SSR,
    // but we only use it client-side. This tells webpack to 
    // return an empty module for 'canvas' during the server build.
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
