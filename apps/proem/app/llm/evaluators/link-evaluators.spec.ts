import { LinkCountEvaluator, ValidTitleEvaluator } from "./link-evaluators";

describe("LinkCountEvaluator", () => {
	it("(0, 0) == 1", () => {
		expect(LinkCountEvaluator.evaluate(0, 0)).toEqual({
			score: 1,
			value: 0,
			comment: "expected: 0-0, actual: 0",
		});
	});

	it("(2, 2) == 0", () => {
		expect(LinkCountEvaluator.evaluate(2, 2)).toEqual({
			score: 0,
			value: 0,
			comment: "expected: 2-2, actual: 0",
		});
	});

	it("(2, 2, string) == 0", () => {
		expect(LinkCountEvaluator.evaluate(2, 2, "foo bar baz")).toEqual({
			score: 0,
			value: 0,
			comment: "expected: 2-2, actual: 0",
		});
	});

	it("(2, 2, one-link) == 0.5", () => {
		expect(LinkCountEvaluator.evaluate(2, 2, "http://foo.bar")).toEqual({
			score: 0.5,
			value: 1,
			comment: "expected: 2-2, actual: 1",
		});
	});

	it("(2, 2, two-links) == 1", () => {
		expect(
			LinkCountEvaluator.evaluate(2, 2, "http://foo.bar https://foo.bar"),
		).toEqual({
			score: 1,
			value: 2,
			comment: "expected: 2-2, actual: 2",
		});
	});

	it("(2, 2, three-links) == 0.5", () => {
		expect(
			LinkCountEvaluator.evaluate(
				2,
				2,
				"http://foo.bar https://foo.bar https://foo.bar",
			),
		).toEqual({
			score: 0.5,
			value: 3,
			comment: "expected: 2-2, actual: 3",
		});
	});

	it("(2, 2, four-links) == 0", () => {
		expect(
			LinkCountEvaluator.evaluate(
				2,
				2,
				"http://foo.bar https://foo.bar https://foo.bar https://foo.bar",
			),
		).toEqual({
			score: 0,
			value: 4,
			comment: "expected: 2-2, actual: 4",
		});
	});

	it("(2, 2, five-links) == 0", () => {
		expect(
			LinkCountEvaluator.evaluate(
				2,
				2,
				"http://foo.bar https://foo.bar https://foo.bar https://foo.bar https://foo.bar",
			),
		).toEqual({
			score: 0,
			value: 5,
			comment: "expected: 2-2, actual: 5",
		});
	});
});

describe("ValidTitleEvaluator", () => {
	it("(0, 0) == 1", () => {
		expect(ValidTitleEvaluator.evaluate(0, 0, "")).toEqual({
			score: 1,
			value: 0,
			comment: 'expected: 0-0, actual: {"titles":[]}',
		});
	});

	it("(1, 1) == 0", () => {
		expect(ValidTitleEvaluator.evaluate(1, 1, "")).toEqual({
			score: 0,
			value: 0,
			comment: 'expected: 1-1, actual: {"titles":[]}',
		});
	});

	it("(1, 3, url) == 1", () => {
		expect(
			ValidTitleEvaluator.evaluate(1, 3, "http://foo.bar?title=baz"),
		).toEqual({
			score: 1,
			value: 3,
			comment: 'expected: 1-3, actual: {"titles":["baz"]}',
		});
	});
});
