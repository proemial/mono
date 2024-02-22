import { countDiff, extractLinks } from "./evaluator-helpers";

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

describe("extractLinks", () => {
	it("extracts link in the middle", () => {
		expect(
			extractLinks("foo https://proem.ai/oa/W1234?title=5678 bar"),
		).toEqual([
			{
				host: "proem.ai",
				path: "/oa/W1234",
				query: "5678",
			},
		]);
	});

	it("extracts link around", () => {
		expect(
			extractLinks(
				"https://proem.ai/oa/W1234?title=5678 foo http://proem.ai/oa/W8765?title=4321",
			),
		).toEqual([
			{
				host: "proem.ai",
				path: "/oa/W1234",
				query: "5678",
			},
			{
				host: "proem.ai",
				path: "/oa/W8765",
				query: "4321",
			},
		]);
	});

	it("handles erratic urls", () => {
		expect(extractLinks("https://somewhere.org/foo/bar/")).toEqual([
			{
				host: "somewhere.org",
				path: "/foo/bar",
				query: "",
			},
		]);
	});

	it("Does not extract special chars at the end", () => {
		expect(extractLinks("https://proem.ai?title=foo+bar+baz)")).toEqual([
			{
				host: "proem.ai",
				path: "/",
				query: "foo bar baz",
			},
		]);
	});
});
