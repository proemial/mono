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
};

export default nextConfig;
