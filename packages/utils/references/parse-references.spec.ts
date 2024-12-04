import { splitAndSanitize } from "./santise-references";
import { describe, it, expect } from "vitest";

describe("splitAndSanitize", () => {
	it("should support happy path", () => {
		const input = "Hello [1] World[2]";
		const references = asReferences(splitAndSanitize(input));

		expect(references).toEqual([["1"], ["2"]]);
	});
	it("should support leading hashes", () => {
		const input = "Hello [#1] World[#2]";
		const references = asReferences(splitAndSanitize(input));

		expect(references).toEqual([["1"], ["2"]]);
	});
	it("should support only hashes", () => {
		const input = "Hello [#] World[#]";
		const references = asReferences(splitAndSanitize(input));

		expect(references).toEqual([["1"], ["2"]]);
	});
});

function asReferences(sanitzed: string[]) {
	return sanitzed
		.map((segment) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				return match[1]?.split(",").map((n) => n.trim());
			}
		})
		.filter(Boolean);
}
