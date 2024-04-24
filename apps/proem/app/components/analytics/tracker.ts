import { analyticsTrace } from "@/app/components/analytics/tracking-profile";
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

		va.track(event, properties);
		ReactGA.event(event, properties);
		posthog.capture(event, properties);

		analyticsTrace("[AnalyticsClient] track", event, properties);
	},
};
