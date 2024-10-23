const { fileURLToPath } = require("node:url");
const jiti = require("jiti")(__filename);
jiti("./env/server");
jiti("./env/client");

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();
const { withSentryConfig } = require("@sentry/nextjs");

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
			{
				protocol: "https",
				hostname: "www.gravatar.com",
			},
			{
				protocol: "https",
				hostname: "asset.dr.dk",
			},
			{
				protocol: "https",
				hostname: "i.guim.co.uk",
			},
		],
	},
};

module.exports = withSentryConfig(withVercelToolbar(nextConfig), {
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	org: "proemial",
	project: "proem",

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Automatically annotate React components to show their full name in breadcrumbs and session replay
	reactComponentAnnotation: {
		enabled: true,
	},

	// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	// tunnelRoute: "/monitoring",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
});

