import { CharCountEvaluator } from "./string-evaluators";

const chars200 =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu";
const chars300 =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.";
const chars400 =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a";

describe("CharCountEvaluator", () => {
  it("evaluate(0, 0, chars0) == 1", () => {
    expect(CharCountEvaluator.evaluate(0, 0, "")).toEqual({
      score: 1,
      value: 0,
      comment: "Expected range: 0-0",
    });
  });
  it("evaluate(2, 2, chars0) == 0", () => {
    expect(CharCountEvaluator.evaluate(2, 2, "")).toEqual({
      score: 0,
      value: 0,
      comment: "Expected range: 2-2",
    });
  });
  it("(2, 2, one-link) == 0.5", () => {
    expect(CharCountEvaluator.evaluate(2, 2, "a")).toEqual({
      score: 0.5,
      value: 1,
      comment: "Expected range: 2-2",
    });
  });
  it("evaluate(200, 400, chars200) == 1", () => {
    expect(CharCountEvaluator.evaluate(200, 400, chars200)).toEqual({
      score: 1,
      value: 200,
      comment: "Expected range: 200-400",
    });
  });
  it("evaluate(200, 400, chars300) == 1", () => {
    expect(CharCountEvaluator.evaluate(200, 400, chars300)).toEqual({
      score: 1,
      value: 300,
      comment: "Expected range: 200-400",
    });
  });
  it("evaluate(200, 400, chars400) == 1", () => {
    expect(CharCountEvaluator.evaluate(200, 400, chars400)).toEqual({
      score: 1,
      value: 400,
      comment: "Expected range: 200-400",
    });
  });

  it("evaluate(200, 400, chars199) == 0.995", () => {
    expect(
      CharCountEvaluator.evaluate(200, 400, chars200.substring(1)),
    ).toEqual({
      score: 0.995,
      value: 199,
      comment: "Expected range: 200-400",
    });
  });

  it("evaluate(200, 400, chars401) == 0.995", () => {
    expect(CharCountEvaluator.evaluate(200, 400, `${chars400}a`)).toEqual({
      score: 0.995,
      value: 401,
      comment: "Expected range: 200-400",
    });
  });

  it("evaluate(200, 400, chars1) == 0.005", () => {
    expect(CharCountEvaluator.evaluate(200, 400, "a")).toEqual({
      score: 0.005,
      value: 1,
      comment: "Expected range: 200-400",
    });
  });
});
