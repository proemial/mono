import {
	LinkCountEvaluator,
	LinksEvaluator,
	ValidLinkEvaluator,
	ValidTitleEvaluator,
} from "./link-evaluators";

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

describe("ValidLinkEvaluator", () => {
	it("no links == 1", () => {
		expect(ValidLinkEvaluator.evaluate("", [])).toEqual({
			score: 1,
			value: 0,
			comment: 'expected: 0-0, actual: {"answerLinks":[],"paperLinks":[]}',
		});
	});

	it("one valid link == 1", () => {
		expect(
			ValidLinkEvaluator.evaluate("Here's a link: https://proem.ai/oa/1234", [
				"/oa/1234",
			]),
		).toEqual({
			score: 1,
			value: 1,
			comment:
				'expected: 1-1, actual: {"answerLinks":[{"host":"proem.ai","path":"/oa/1234","query":""}],"paperLinks":["/oa/1234"]}',
		});
	});

	it("one invalid link == 0.5", () => {
		expect(
			ValidLinkEvaluator.evaluate(
				"Valid: https://proem.ai/oa/1234 and invalid: https://proem.ai/oa/2345",
				["/oa/1234"],
			),
		).toEqual({
			score: 0.5,
			value: 1,
			comment:
				'expected: 2-2, actual: {"answerLinks":[{"host":"proem.ai","path":"/oa/1234","query":""},{"host":"proem.ai","path":"/oa/2345","query":""}],"paperLinks":["/oa/1234"]}',
		});
	});

	it("Ywo invalid links == 0", () => {
		expect(
			ValidLinkEvaluator.evaluate(
				"Valid: https://proem.ai/oa/1234 and invalid: https://proem.ai/oa/2345",
				["/oa/foo"],
			),
		).toEqual({
			score: 0,
			value: 0,
			comment:
				'expected: 2-2, actual: {"answerLinks":[{"host":"proem.ai","path":"/oa/1234","query":""},{"host":"proem.ai","path":"/oa/2345","query":""}],"paperLinks":["/oa/foo"]}',
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

describe("LinksEvaluator", () => {
	it("(1, 2) one-link == 1", () => {
		const paperLinks = ["/oa/W2030447619"];
		const answer =
			"more information in the papers: [Grapes, Wines, Resveratrol, and Heart Health](/oa/W2030447619) and";
		const result = LinksEvaluator.evaluate(1, 2, answer, paperLinks);

		expect(result.score).toBe(1);
	});

	it("(2, 2) two-links == 1", () => {
		const paperLinks = ["/oa/W2030447619", "/oa/W2101940624"];
		const answer =
			"Learn more [here](/oa/W2030447619?title=Grapes%2C+Wines%2C+Resveratrol%2C+and+Heart+Health) and [here](/oa/W2101940624?title=Wine+and+Your+Heart).";
		const result = LinksEvaluator.evaluate(2, 2, answer, paperLinks);

		expect(result.score).toBe(1);
	});

	it("(1, 2) no-links == 0", () => {
		const paperLinks = ["/oa/W2030447619", "/oa/W2101940624"];
		const answer = "no links :(";
		const result = LinksEvaluator.evaluate(1, 2, answer, paperLinks);

		expect(result.score).toBe(0);
	});

	it("(2, 2) one-link == 0.5", () => {
		const paperLinks = ["/oa/W2030447619", "/oa/W2101940624"];
		const answer =
			"more information in the papers: [Grapes, Wines, Resveratrol, and Heart Health](/oa/W2030447619) and";
		const result = LinksEvaluator.evaluate(2, 2, answer, paperLinks);

		expect(result.score).toBe(0.5);
	});
});
