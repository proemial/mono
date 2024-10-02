import { oaByDateStream } from "./workers/oa/by-date.task";
import { embedStream } from "./workers/embed.task";
import { oaByRangeStream } from "./workers/oa/by-range";
import { oaBySinceYesterday } from "./workers/oa/since-yesterday.task";

export const streams = [
	oaByDateStream.worker,
	embedStream.worker,
	oaByRangeStream.worker,
	oaBySinceYesterday.worker,
];
