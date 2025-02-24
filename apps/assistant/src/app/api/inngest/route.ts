import { inngest } from "@/inngest/client";
import { workers, schedulers } from "../../../inngest/workers";
import { serve } from "inngest/next";

export const revalidate = 0;

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [...workers, ...schedulers],
});
