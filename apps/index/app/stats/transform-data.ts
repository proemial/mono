import dayjs from "dayjs";
import {
	ChartDataPoint,
	ChartDataPoints,
	IngestionStats,
} from "./stats.models";

export function transformData(
	input: IngestionStats,
	all?: boolean,
): ChartDataPoints {
	const endDate = dayjs(input.data.at(-1)?.timestamp);
	const buckets = getBuckets(endDate);

	Object.keys(buckets).forEach((date) => {
		const events = input.data.filter(
			(entry) => dayjs(entry.timestamp).format("YYYY-MM-DD") === date,
		);

		const lastExpected = events.findLastIndex(
			(event) => event.name === "expected",
		);
		const latestRun = all ? events : events.slice(lastExpected);

		const item = {
			date,
			total: 0,
			fetched: 0,
			embedded: 0,
			upserted: 0,
			diff: 0,
		};
		latestRun.forEach((event) => {
			switch (event.name) {
				case "fetched":
				case "embedded":
				case "upserted":
					item[event.name] += event.value;
					break;
				case "expected":
					item.total = all ? item.total + event.value : event.value;
					break;
			}
		});

		buckets[date] = item;
	});
	return Object.values(buckets).map(
		(entry) =>
			({
				...entry,
				diff: entry?.total
					? Number(
							(
								((entry.total - (entry?.upserted ?? 0)) / entry.total) *
								100
							).toFixed(2),
						)
					: 0,
			}) as ChartDataPoint,
	);
}

function getBuckets(
	endDate: dayjs.Dayjs,
): Record<string, ChartDataPoint | undefined> {
	const buckets: Record<string, ChartDataPoint | undefined> = {};
	for (let i = 6; i >= 0; i--) {
		const date = endDate.subtract(i, "day").format("YYYY-MM-DD");
		buckets[date] = undefined;
	}

	return buckets;
}
