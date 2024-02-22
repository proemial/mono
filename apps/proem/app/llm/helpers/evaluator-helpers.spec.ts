import { countDiff } from "./evaluator-helpers";

describe("withinBasedScore", () => {
	it("(0, 99) == 0", () => {
		expect(countDiff(0, 99)).toBe(0);
	});
	it("(0, 5, 0) == 0", () => {
		expect(countDiff(0, 5, 0)).toBe(0);
	});
	it("(5, 10, 0) == -5", () => {
		expect(countDiff(5, 10, 0)).toBe(5);
	});

	it("(5, 10, 15) = -5", () => {
		expect(countDiff(5, 10, 15)).toBe(5);
	});
});
