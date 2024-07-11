import dayjs from "dayjs";
import { Client } from "langsmith";
import { NextRequest } from "next/server";

export const revalidate = 1;
export const maxDuration = 300;

// Will time out in production
const enabled = false;

type Month =
	| "Jan"
	| "Feb"
	| "Mar"
	| "Apr"
	| "May"
	| "Jun"
	| "Jul"
	| "Aug"
	| "Sep"
	| "Oct"
	| "Nov"
	| "Dec";
type Value = { [key: string]: number };

export async function GET(req: NextRequest) {
	const data = {} as { [key in Month]: Value };

	if (!enabled) {
		return Response.json({ information: "disabled in prod" });
	}

	const client = new Client();
	const runs = client.listRuns({
		projectName: "proem",
		executionOrder: 1,
		select: ["start_time", "name"],
	});

	let logCounter = 0;
	for await (const run of runs) {
		const month = dayjs(run.start_time).format("MMM") as Month;
		const name = run.name;

		if (!Object.keys(data).includes(month)) {
			data[month] = {};
		}
		if (!Object.keys(data[month]).includes(name)) {
			data[month][name] = 0;
		}
		if (data[month]?.[name]) {
			data[month][name] += 1;
		}

		if (++logCounter % 500) {
			console.log(`Still running... " ${logCounter} runs processed`);
		}
	}
	return Response.json(data);
}
