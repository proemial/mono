import { NextRequest } from "next/server";
import { Client } from "langsmith";

export const revalidate = 1;

export async function GET(req: NextRequest) {
	const client = new Client();
	const runs = client.listRuns({
		projectName: "proem",
		executionOrder: 1,
		startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
		filter: 'eq(name,"Ask")',
	});

	const questions = {} as { [key: string]: number };
	for await (const run of runs) {
		const question = run?.inputs?.question;

		if (!questions[question]) {
			questions[question] = 0;
		}
		questions[question] += 1;
	}

	const sortedKeys = Object.keys(questions).sort(
		(a, b) => (questions[b] as number) - (questions[a] as number),
	);
	const result = {} as { [key: string]: number };
	// biome-ignore lint/complexity/noForEach: <explanation>
	sortedKeys.forEach((key) => {
		result[key] = questions[key] as number;
	});

	return Response.json(result);
}
