import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { streamCacheUpdateScheduler } from "@/inngest/scheduler.task";
import {
	streamCacheUpdate,
	streamScheduledCacheUpdate,
} from "@/inngest/populator.task";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		streamCacheUpdateScheduler,
		streamScheduledCacheUpdate.worker,
		streamCacheUpdate.worker,
	],
});
