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
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/:path*",
					has: [
						{
							type: "host",
							value: "beta.localhost",
						},
					],
					destination: "/beta/:path*",
				},
				{
					source: "/:path*",
					has: [
						{
							type: "host",
							value: "beta.proem.ai",
						},
					],
					destination: "/beta/:path*",
				},
			],
		};
	},
	sentry: {
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
		hideSourceMaps: true,
	},
};

const sentryWebpackPluginOptions = {
	org: "proemial",
	project: "proem",
	authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
