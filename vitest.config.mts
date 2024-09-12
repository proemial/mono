import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
	plugins: [tsconfigPaths({})],
	test: {
		globals: true,
		...config({ path: "./apps/proem/.env.local" }).parsed,
	},
});
