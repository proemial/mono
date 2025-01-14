/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	// LlamaIndex (and Huggingface transformers.js) requires sharp and onnxruntime-node to build
	// Source: https://huggingface.co/docs/transformers.js/en/tutorials/next
	experimental: {
		serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			sharp$: false,
			"onnxruntime-node$": false,
		};
		return config;
	},
};

export default nextConfig;
