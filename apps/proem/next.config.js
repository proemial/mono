/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/utils"],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "gpt.proem.ai",
            },
          ],
          destination: "https://chat.openai.com/g/g-SxYGBAT0I-science-proems",
        },
      ],
    };
  },
};
