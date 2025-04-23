const jiti = require("jiti")(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@proemial/data",
    "@proemial/models",
    "@proemial/redis",
    "@proemial/repositories",
    "@proemial/shadcn-ui",
    "@proemial/utils",
  ],
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

module.exports = nextConfig;
