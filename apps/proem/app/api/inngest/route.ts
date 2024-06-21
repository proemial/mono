import { inngest } from "@/inngest/client";
import {
	streamCacheUpdate,
	streamScheduledCacheUpdate,
} from "@/inngest/populator.task";
import {
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
	],
});
