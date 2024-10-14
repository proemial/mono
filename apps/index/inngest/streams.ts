import { oaByDateStream } from "./workers/oa/oa-by-date.task";
import { oaByRangeStream } from "./workers/oa/oa-by-range";
import { oaSinceYesterday } from "./workers/oa/oa-yesterday.task";
import { oaScheduler } from "./scheduler/oa-scheduler.task";
import { embedTask } from "./workers/utils/embed.task";
import { uuidTask } from "./workers/utils/uuid.task";
import { syncIndicesStream } from "./workers/utils/sync-indices";

export const workers = [
	oaByDateStream.worker,
	oaByRangeStream.worker,
	oaSinceYesterday.worker,
	embedTask.worker,
	uuidTask.worker,
	syncIndicesStream.worker,
];

export const schedulers =
	process.env.NODE_ENV !== "development" ? [oaScheduler] : [];
