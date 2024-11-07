import { inngest } from "@/inngest/client";
import { NewsFlushTask } from "@/inngest/news-flush.task";
import {
	streamCacheUpdate,
	streamScheduledCacheUpdate,
} from "@/inngest/populator.task";
import {
	newsFlushScheduler,
	spacesStreamCacheUpdateScheduler,
	streamCacheUpdateScheduler,
} from "@/inngest/scheduler.task";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		streamCacheUpdateScheduler,
		spacesStreamCacheUpdateScheduler,
		streamScheduledCacheUpdate.worker,
		streamCacheUpdate.worker,
		NewsFlushTask.worker,
		newsFlushScheduler,
	],
});
