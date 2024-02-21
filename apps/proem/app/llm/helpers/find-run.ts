import { Run } from "@langchain/core/tracers/base";

export function findRun(
  within: Run,
  predicate: (run: Run) => boolean,
): Run | undefined {
  if (!within) {
    return undefined;
  }

  if (predicate(within)) {
    return within;
  }

  for (const child of within.child_runs || []) {
    const found = findRun(child, predicate);
    if (found) {
      return found;
    }
  }
  return undefined;
}
