/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	// Indicate that these packages should not be bundled by webpack
	// Source: https://github.com/huggingface/transformers.js/blob/main/examples/next-server/next.config.js
	experimental: {
		serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
	},
};

export default nextConfig;
