import { Run } from "@langchain/core/tracers/base";

export function runOutputAsString(run: Run) {
	// @ts-ignore
	const bytes: Uint8Array[] = (run?.outputs && run.outputs) ?? [];
	return new Buffer(bytes).toString();
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
