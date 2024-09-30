import { v5 } from "uuid";
import { describe, it, expect } from "vitest";

// const namespace = v4();
const namespaces = {
	openalex: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
	arxiv: "f23e6fb0-1b36-4bad-ba6b-0d1a06a4faa0",
};

describe("uuid", () => {
	it("should generate idempotent OA ids", () => {
		const fixture = [
			"https://openalex.org/W4402331651",
			"https://openalex.org/W4402311281",
			"https://openalex.org/W4402568028",
			"https://openalex.org/W4402136189",
			"https://openalex.org/W4402232011",
			"https://openalex.org/W4402118787",
			"https://openalex.org/W4402256769",
			"https://openalex.org/W4402397894",
			"https://openalex.org/W4402484103",
			"https://openalex.org/W4402148516",
		];

		validateUuid(fixture, namespaces.openalex);
	});

	it("should generate idempotent arXiv ids", () => {
		const fixture = [
			"1706.03762",
			"2409.12183",
			"2409.12183v1",
			"2409.15268",
			"2408.10914",
			"2201.02348",
			"2305.18290",
			"2305.18290v3",
			"2409.04109",
			"2402.10200",
		];

		validateUuid(fixture, namespaces.arxiv);
	});
});

function validateUuid(fixture: string[], namespace: string) {
	const allIds = new Set();
	fixture.forEach((id) => {
		const ids = new Set();
		for (let i = 0; i < 10; i++) {
			ids.add(v5(id, namespace));
			allIds.add(v5(id, namespace));
		}
		expect(ids.size).toBe(1);
	});
	expect(allIds.size).toBe(fixture.length);
}
