/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure Prisma is properly handled
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Prisma is properly transpiled
      config.externals = [...config.externals, 'prisma', '@prisma/client'];
    }
    return config;
  },
};

export default nextConfig;
