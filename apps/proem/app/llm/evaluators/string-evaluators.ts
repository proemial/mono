import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { Run } from "@langchain/core/tracers/base";
import {
  calculateDiffScore,
  runOutputAsString,
} from "../helpers/evaluator-helpers";

export class CharCountEvaluator implements RunEvaluator {
  constructor(
    private min: number,
    private max: number,
  ) {}

  async evaluateRun(run: Run): Promise<EvaluationResult> {
    const output = runOutputAsString(run);
    const result = CharCountEvaluator.evaluate(this.min, this.max, output);

    return { key: "chars", ...result };
  }

  static evaluate(min: number, max: number, text?: string) {
    const value = text?.trim().length ?? 0;
    const score = calculateDiffScore(min, max, value);
    const comment = `Expected range: ${min}-${max}`;

    return { value, score, comment };
  }
}
