import * as Sentry from "@sentry/nextjs";

export const Metrics = {
	papersFetched: (type: string, value: number) => {
		console.log(`Gauge: oa.${type}.count = ${value}`);

		Sentry.metrics.gauge(`oa.${type}.count`, value, {
			tags: { feature: "ask", type: "prompt" },
		});
	},
};
