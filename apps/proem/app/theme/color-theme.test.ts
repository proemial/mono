import { describe, expect, it } from "vitest";
import { ThemeColor, generateColorTheme } from "./color-theme";

describe("generateColorHelper", () => {
	const testCases: ThemeColor[] = ["purple", "teal", "green", "rose", "gold"];

	for (const color of testCases) {
		it(`should generate correct color helper for ${color}`, () => {
			const result = generateColorTheme(color);

			// Check if all expected keys are present
			const expectedKeys = [
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
				"950",
			];

			for (const key of expectedKeys) {
				expect(result).toHaveProperty(key);
			}

			// Check if the generated strings are correct
			for (const [key, value] of Object.entries(result)) {
				expect(value).toBe(`rgb(var(--color-${color}-${key}) / <alpha-value>)`);
			}
		});
	}
});
