import { analyticsTrace } from "@/app/components/analytics/tracking/tracking-profile";
import va from "@vercel/analytics";
import posthog from "posthog-js";
import ReactGA from "react-ga4";

export const Tracker = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	track: (event: string, properties?: Record<string, any>) => {
		// autocapture is enabled for all users except internal users.
		if (!posthog.autocapture) {
			analyticsTrace("[AnalyticsClient] track aborted");
			return;
		}
		const eventPrefixed = `proem:${event}`;

		va.track(eventPrefixed, properties);
		ReactGA.event(eventPrefixed, properties);
		posthog.capture(eventPrefixed, properties);

		analyticsTrace("[AnalyticsClient] track", eventPrefixed, properties);
	},
};
