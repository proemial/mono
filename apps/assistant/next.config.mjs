/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	webpack: (config) => {
		config.resolve.fallback = {
			"mongodb-client-encryption": false,
			"aws4": false
		};
		return config;
	}
};

export default nextConfig;
