import { oaByDateStream } from "./workers/oa/oa-by-date.task";
import { oaByRangeStream } from "./workers/oa/oa-by-range";
import { oaSinceYesterday } from "./workers/oa/oa-yesterday.task";
import { oaScheduler } from "./scheduler/oa-scheduler.task";

export const workers = [
	oaByDateStream.worker,
	oaByRangeStream.worker,
	oaSinceYesterday.worker,
];

export const schedulers =
	process.env.NODE_ENV !== "development" ? [oaScheduler] : [];
