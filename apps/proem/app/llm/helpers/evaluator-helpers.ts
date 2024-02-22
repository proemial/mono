import { Run } from "@langchain/core/tracers/base";

export function runOutputAsString(run: Run) {
  // @ts-ignore
  const bytes: Uint8Array[] = (run?.outputs && run.outputs) ?? [];
  return new Buffer(bytes).toString();
}

export function calculateDiffScore(min: number, max: number, value?: number) {
  const diff = countDiff(min, max, value);
  const percent = (max === min ? max : max - min) / 100;
  const precisionScore = 1 - diff / percent / 100;
  const score = diff ? Number((precisionScore || 0).toFixed(3)) : 1;

  return Math.max(0, score);
}

export function countDiff(min: number, max: number, value?: number): number {
  if (value === undefined || Number.isNaN(value)) {
    return 0;
  }

  if (value >= min && value <= max) {
    return 0;
  }

  if (value < min) {
    return min - value;
  }

  return value - max;
}
