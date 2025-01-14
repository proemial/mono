/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	// LlamaIndex (and Huggingface transformers.js) requires sharp and onnxruntime-node to build on Vercel
	// Source: https://huggingface.co/docs/transformers.js/en/tutorials/next
	experimental: {
		serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
	},
	output: "standalone"
};

export default nextConfig;
