import { oaByDateStream } from "./workers/oa/by-date.task";
import { oaByRangeStream } from "./workers/oa/by-range";
import { oaSinceYesterday } from "./workers/oa/since-yesterday.task";
import { ingestionScheduler } from "./scheduler/scheduler.task";

export const streams = [
	oaByDateStream.worker,
	oaByRangeStream.worker,
	oaSinceYesterday.worker,
	ingestionScheduler,
];
