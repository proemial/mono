import { oaByDateStream } from "./workers/oa/by-date.task";
import { oaByRangeStream } from "./workers/oa/by-range";
import { oaSinceYesterday } from "./workers/oa/since-yesterday.task";
import { ingestionScheduler } from "./scheduler/scheduler.task";

export const workers = [
	oaByDateStream.worker,
	oaByRangeStream.worker,
	oaSinceYesterday.worker,
];

export const schedulers =
	process.env.NODE_ENV !== "development" ? [ingestionScheduler] : [];
