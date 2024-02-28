import { Run } from "@langchain/core/tracers/base";

export function findRunPaperLinks(run: Run): string[] {
	type WithLink = { link: string };

	const papersString = findRunWithPapersInput(run)?.inputs.papers as
		| string
		| undefined;

	const papers = (papersString ? JSON.parse(papersString) : []) as WithLink[];

	return papers.map((paper) => paper.link);
}

export function findRunWithPapersInput(run: Run): Run | undefined {
	return findRun(run, (run) => run.inputs.papers);
}
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
