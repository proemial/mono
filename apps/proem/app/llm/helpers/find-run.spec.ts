import { findRun } from "./find-run";
import { Run } from "@langchain/core/tracers/base";

describe("findRun", () => {
	it("Returns undefined when unmatched", () => {
		const fixture = { id: "" } as Run;
		const predicate = (run: Run) => run.id === "dummy";

		expect(findRun(fixture, predicate)).toBeUndefined();
	});

	it("Returns undefined on empty run", () => {
		const predicate = (run: Run) => run.id === "dummy";

		// @ts-ignore
		expect(findRun(undefined, predicate)).toBeUndefined();
		// @ts-ignore
		expect(findRun({}, predicate)).toBeUndefined();
	});

	it("Returns root-level match", () => {
		const fixture = { id: "dummy" } as Run;
		const predicate = (run: Run) => run.id === "dummy";

		expect(findRun(fixture, predicate)).toEqual(fixture);
	});

	it("Returns nested match", () => {
		const match = { id: "level 2.2" };
		const fixture = {
			id: "level 0",
			child_runs: [{ id: "level 1", child_runs: [{ id: "level 2.1" }, match] }],
		} as Run;
		const predicate = (run: Run) => run.id === "level 2.2";

		expect(findRun(fixture, predicate)).toEqual(match);
	});
});
