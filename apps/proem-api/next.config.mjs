/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	// Indicate that these packages should not be bundled by webpack
	experimental: {
		serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
	},
};

export default nextConfig;
