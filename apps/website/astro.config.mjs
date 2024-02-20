import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	redirects: {
		"/survey": {
			status: 302,
			destination: "https://tally.so/r/mB7Q7e",
		},
	},
	output: "server",
	integrations: [tailwind()],
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
});
