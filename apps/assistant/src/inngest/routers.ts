import { eventName as scrapeEventName } from "./workers/annotate/scrape.task";
import { eventName as summarizeEventName } from "./workers/annotate/summarize.task";
import { inngest } from "./client";

export const AnnotateRouter = {
	next: async (step: string, url: string) => {
		switch (step) {
			case scrapeEventName: {
				const result = await inngest.send({
					name: summarizeEventName,
					data: {
						url,
					},
				});
				console.log("summarize result", result);
				return summarizeEventName;
			}
			case summarizeEventName:
				// TODO: Create event for summarise
				return "routing/slack";
		}
	},
};
