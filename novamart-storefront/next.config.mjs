/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 75, 100], 
    unoptimized: true,
    // remotePatterns is the secure way to allow external or local images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**', // This allows images from any secure HTTPS source
      },
    ],
  },
  // This helps with the 404 issue by ensuring the middleware handles routes correctly
  reactStrictMode: true,
};

export default nextConfig;