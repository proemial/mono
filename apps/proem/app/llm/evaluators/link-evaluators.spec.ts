import { LinkCountEvaluator } from "./link-evaluators";

describe("LinkCountEvaluator", () => {
	it("(0, 0) == 1", () => {
		expect(LinkCountEvaluator.evaluate(0, 0)).toEqual({
			score: 1,
			value: 0,
			comment: "Expected range: 0-0",
		});
	});

	it("(2, 2) == 0.8", () => {
		expect(LinkCountEvaluator.evaluate(2, 2)).toEqual({
			score: 0.8,
			value: 0,
			comment: "Expected range: 2-2",
		});
	});

	it("(2, 2, 'foo bar baz') == 0.8", () => {
		expect(LinkCountEvaluator.evaluate(2, 2, "foo bar baz")).toEqual({
			score: 0.8,
			value: 0,
			comment: "Expected range: 2-2",
		});
	});

	it("(2, 2, 'http://foo.bar') == 0.9", () => {
		expect(LinkCountEvaluator.evaluate(2, 2, "http://foo.bar")).toEqual({
			score: 0.9,
			value: 1,
			comment: "Expected range: 2-2",
		});
	});

	// Works, but vitest breaks
	it("(2, 2, 'http://foo.bar') == 0.9", () => {
		expect(
			LinkCountEvaluator.evaluate(2, 2, "http://foo.bar https://foo.bar"),
		).toEqual({
			score: 1,
			value: 2,
			comment: "Expected range: 2-2",
		});
	});
});
