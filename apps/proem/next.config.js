/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/utils"],
  async rewrites() {
    return {
      beforeFiles: [
        // if the host is `app.acme.com`,
        // this rewrite will be applied
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "(?<gpt>.*)\\..*",
            },
          ],
          destination: "https://chat.openai.com/g/g-SxYGBAT0I-science-proems",
        },
      ],
    };
  },
};
