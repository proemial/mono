import { WordCountEvaluator } from "./string-evaluators";

describe("WordCountEvaluator", () => {
	it("evaluate(5, 10) == 0.95", () => {
		expect(WordCountEvaluator.evaluate(5, 10)).toEqual({
			score: 0.75,
			value: 0,
			comment: "Expected range: 5-10",
		});
	});
	it("evaluate(0, 5) == 1", () => {
		expect(WordCountEvaluator.evaluate(0, 5)).toEqual({
			score: 1,
			value: 0,
			comment: "Expected range: 0-5",
		});
	});

	it("evaluate(5, 50, 'foo bar baz gaz jaz') == 1", () => {
		expect(WordCountEvaluator.evaluate(5, 50, "foo bar baz gaz jaz")).toEqual({
			score: 1,
			value: 5,
			comment: "Expected range: 5-50",
		});
	});
	it("evaluate(0, 5, 'foo bar baz gaz jaz') == 1", () => {
		expect(WordCountEvaluator.evaluate(0, 5, "foo bar baz gaz jaz")).toEqual({
			score: 1,
			value: 5,
			comment: "Expected range: 0-5",
		});
	});

	it("evaluate(5, 50, 'foo bar baz gaz') == 0.95", () => {
		expect(WordCountEvaluator.evaluate(5, 50, "foo bar baz gaz")).toEqual({
			score: 0.95,
			value: 4,
			comment: "Expected range: 5-50",
		});
	});
	it("evaluate(0, 4, 'foo bar baz gaz jaz') == 0.95", () => {
		expect(WordCountEvaluator.evaluate(0, 4, "foo bar baz gaz jaz")).toEqual({
			score: 0.95,
			value: 5,
			comment: "Expected range: 0-4",
		});
	});
});
