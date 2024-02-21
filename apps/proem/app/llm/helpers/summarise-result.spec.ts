import { WithResults, summariseRunResults } from "./summarise-result";

function asWithResults(results: number[][]): WithResults {
  const withResults = {
    results: {}
  } as WithResults;

  results.forEach((result, i) => {
    withResults.results[`result_${i}`] = {
      feedback: result.map((score, j) => ({
        key: `evaluator_${j}`,
        score,
      })),
    };
  });

  return withResults;
}


describe("summariseRunResults", () => {
  it("Works for two results with 1 passing evaluator", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[1, 1]]));

    expect(avg).toBe(1);
    expect(scores).toEqual([1, 1]);
  });

  it("Works for one result with 2 passing evaluators", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[1],[1]]));

    expect(avg).toBe(1);
    expect(scores).toEqual([1, 1]);
  });

  it("Works for two results with 1 failing evaluator", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[0, 0]]));

    expect(avg).toBe(0);
    expect(scores).toEqual([0, 0]);
  });

  it("Works for one result with 2 failing evaluators", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[0],[0]]));

    expect(avg).toBe(0);
    expect(scores).toEqual([0, 0]);
  });

  it("Works for two results with 1 passing/failing evaluator", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[1, 0]]));

    expect(avg).toBe(0.5);
    expect(scores).toEqual([1, 0]);
  });

  it("Works for one result with 2 passing/failing evaluators", () => {
    const {scores, avg} = summariseRunResults(asWithResults([[1],[0]]));

    expect(avg).toBe(0.5);
    expect(scores).toEqual([1, 0]);
  });
});
