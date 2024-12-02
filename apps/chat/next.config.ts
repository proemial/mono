import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  env: {
    POSTGRES_URL: "postgres://default:twEv1pBlR9Jd@ep-curly-snowflake-a2kop02b-pooler.eu-central-1.aws.neon.tech/verceldb?sslmode=require",
  },
};

export default nextConfig;
