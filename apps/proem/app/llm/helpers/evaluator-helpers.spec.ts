import {
	calculateDiffScore,
	countDiff,
	extractLinks,
	extractATag,
} from "./evaluator-helpers";

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

	it("(200, 400, 300) = 1", () => {
		expect(countDiff(200, 400, 300)).toBe(0);
	});
});

describe("calculateDiffScore", () => {
	it("200 [200-400] = 1", () => {
		expect(calculateDiffScore(200, 400, 200)).toBe(1);
	});
	it("300 [200-400] = 1", () => {
		expect(calculateDiffScore(200, 400, 300)).toBe(1);
	});
	it("400 [200-400] = 1", () => {
		expect(calculateDiffScore(200, 400, 400)).toBe(1);
	});

	it("100 [200-400] = 0.5", () => {
		expect(calculateDiffScore(200, 400, 100)).toBe(0.5);
	});
	it("500 [200-400] = 0.5", () => {
		expect(calculateDiffScore(200, 400, 500)).toBe(0.5);
	});

	it("50 [200-400] = 0.25", () => {
		expect(calculateDiffScore(200, 400, 50)).toBe(0.25);
	});
	it("550 [200-400] = 0.25", () => {
		expect(calculateDiffScore(200, 400, 550)).toBe(0.25);
	});

	it("0 [200-400] = 0", () => {
		expect(calculateDiffScore(200, 400, 0)).toBe(0);
	});
	it("600 [200-400] = 0", () => {
		expect(calculateDiffScore(200, 400, 600)).toBe(0);
	});

	it("0 [2-2] = 0", () => {
		expect(calculateDiffScore(2, 2, 0)).toBe(0);
	});
	it("1 [2-2] = 0.5", () => {
		expect(calculateDiffScore(2, 2, 1)).toBe(0.5);
	});
	it("2 [2-2] = 1", () => {
		expect(calculateDiffScore(2, 2, 2)).toBe(1);
	});
	it("3 [2-2] = 0.5", () => {
		expect(calculateDiffScore(2, 2, 3)).toBe(0.5);
	});
	it("4 [2-2] = 0", () => {
		expect(calculateDiffScore(2, 2, 4)).toBe(0);
	});
	it("5 [2-2] = 0", () => {
		expect(calculateDiffScore(2, 2, 5)).toBe(0);
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

describe("extractATag", () => {
	it("extracts a tag", () => {
		const text =
			'more information in the papers: <a href="/oa/W2030447619">Grapes, Wines, Resveratrol, and Heart Health</a> and';
		const expected =
			'<a href="/oa/W2030447619">Grapes, Wines, Resveratrol, and Heart Health</a>';
		const aTags = extractATag(text);
		expect(aTags[0]).toEqual(expected);
		expect(aTags.length).toBe(1);
	});

	it("extracts a tag w/ query param", () => {
		const text =
			'more information in the papers: <a href="/oa/W2030447619?title=foo+bar+baz">Grapes, Wines, Resveratrol, and Heart Health</a> and';
		const expected =
			'<a href="/oa/W2030447619?title=foo+bar+baz">Grapes, Wines, Resveratrol, and Heart Health</a>';
		const aTags = extractATag(text);
		expect(aTags[0]).toEqual(expected);
		expect(aTags).toHaveLength(1);
	});

	it("extracts multiple a tags", () => {
		const text =
			'Two links: <a href="/oa/W2030447619">1st title</a> and <a href="/oa/W2030447619">2nd title</a>.';
		const expected = [
			'<a href="/oa/W2030447619">1st title</a>',
			'<a href="/oa/W2030447619">2nd title</a>',
		];
		const aTags = extractATag(text);
		expect(aTags).toEqual(expected);
		expect(aTags).toHaveLength(2);
	});

	it("extracts multiple a tags w/ query params", () => {
		const text =
			'Two links: <a href="/oa/W2030447619?title=foo+bar">1st title</a> and <a href="/oa/W2030447619?title=baz">2nd title</a>.';
		const expected = [
			'<a href="/oa/W2030447619?title=foo+bar">1st title</a>',
			'<a href="/oa/W2030447619?title=baz">2nd title</a>',
		];
		const aTags = extractATag(text);
		expect(aTags).toEqual(expected);
		expect(aTags).toHaveLength(2);
	});

	it("extracts no a tags", () => {
		const text = "No links :(";
		const aTags = extractATag(text);
		expect(aTags).toHaveLength(0);
	});
});
