import { defineProject } from "vitest/config";

export default defineProject({
	test: {
		include: ["**/*.spec.ts?(x)"],
		environment: "node",
		globals: true,
	},
});
