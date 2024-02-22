import { LinkCountEvaluator } from "./link-evaluators";

describe("LinkCountEvaluator", () => {
  it("(0, 0) == 1", () => {
    expect(LinkCountEvaluator.evaluate(0, 0)).toEqual({
      score: 1,
      value: 0,
      comment: "Expected range: 0-0",
    });
  });

  it("(2, 2) == 0", () => {
    expect(LinkCountEvaluator.evaluate(2, 2)).toEqual({
      score: 0,
      value: 0,
      comment: "Expected range: 2-2",
    });
  });

  it("(2, 2, string) == 0", () => {
    expect(LinkCountEvaluator.evaluate(2, 2, "foo bar baz")).toEqual({
      score: 0,
      value: 0,
      comment: "Expected range: 2-2",
    });
  });

  it("(2, 2, one-link) == 0.5", () => {
    expect(LinkCountEvaluator.evaluate(2, 2, "http://foo.bar")).toEqual({
      score: 0.5,
      value: 1,
      comment: "Expected range: 2-2",
    });
  });

  it("(2, 2, two-links) == 1", () => {
    expect(
      LinkCountEvaluator.evaluate(2, 2, "http://foo.bar https://foo.bar"),
    ).toEqual({
      score: 1,
      value: 2,
      comment: "Expected range: 2-2",
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
      comment: "Expected range: 2-2",
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
      comment: "Expected range: 2-2",
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
      comment: "Expected range: 2-2",
    });
  });
});
