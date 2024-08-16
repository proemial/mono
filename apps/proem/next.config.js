/** @type {import('next').NextConfig} */


const withVercelToolbar = require('@vercel/toolbar/plugins/next')();
const { withSentryConfig } = require("@sentry/nextjs");

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
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
};

module.exports = withVercelToolbar(withSentryConfig((nextConfig), {
	org: "proemial",
	project: "proem",
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
	hideSourceMaps: true,
	widenClientFileUpload: true,
}));
