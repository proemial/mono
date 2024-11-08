import { trimToApproximateTokenLimit } from "./embeddings";
import { describe, it, expect } from "vitest";

describe("trimToTokenLimit", () => {
	it("should return the input if it's shorter than the limit", () => {
		const input = "Hello, World!";

		const trimmed = trimToApproximateTokenLimit(input, 4);

		expect(trimmed).toBe(input);
	});

	it("should trim the input to the limit", () => {
		const input = "Hello, World!";

		const trimmed = trimToApproximateTokenLimit(input, 3);

		expect(trimmed).toBe("Hello, World");
	});
});
