import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { scheduler } from "@/inngest/scheduler.task";
import { populator } from "@/inngest/populator.task";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [scheduler, populator],
});
