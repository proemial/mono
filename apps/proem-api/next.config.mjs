/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@proemial/adapters",
		"@proemial/utils",
	],
	experimental: {
		serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
	},
};

export default nextConfig;
