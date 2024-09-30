/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/models",
		"@proemial/repositories",
		"@proemial/utils",
	],
};

export default nextConfig;
