/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  transpilePackages: ["@repo/utils"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "gpt.proem.ai",
          },
        ],
        destination: "https://chat.openai.com/g/g-SxYGBAT0I-science-proems",
        permanent: false,
      },
    ];
  },
};

const isProd = process.env.NODE_ENV !== "development";
module.exports = isProd
  ? withSentryConfig(
      {
        ...nextConfig,
        sentry: {
          // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
          hideSourceMaps: true,
        },
      },
      {
        org: "proemial",
        project: "proem",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    )
  : nextConfig;
