import { Time } from "@proemial/utils/time";
import * as Sentry from "@sentry/nextjs";

export const Metrics = {
	paperQueryExecuted: (type: string, value: number) => {
		console.log(`Gauge: oa.${type}.count = ${value}`);

		Sentry.metrics.gauge(`proem.oa.${type}.count`, value, {
			tags: { feature: "ask", type: "prompt" },
		});
	},
	now: () => Time.now(),
	elapsed: (begin: number, key: string) => {
		Sentry.metrics.gauge(`proem.${key}.elapsed`, Time.elapsed(begin), {
			unit: "millisecond",
		});
	},
};
