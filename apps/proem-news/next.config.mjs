import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */

const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/shadcn-ui",
		"@proemial/utils",
	],
};

export default withSentryConfig(nextConfig, {
	org: "proemial",
	project: "proem-news",
	silent: true,
});
