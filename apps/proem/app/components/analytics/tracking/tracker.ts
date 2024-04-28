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
	trackPage: {
		posthog: (key: string, path: string) => {
			analyticsTrace("[PosthogClient] trackPage:", format(key), path);
			posthog.capture(format(key), {
				path,
			});
		},
		google: (key: string, path: string) => {
			analyticsTrace("[GaClient] trackPage:", format(key), path);
			ReactGA.send({ hitType: "pageview", page: path, title: format(key) });
			ReactGA.event(format(key), {
				path,
			});
		},
		vercel: (key: string, path: string) => {
			analyticsTrace("[VaClient] trackPage:", format(key), path);
			va.track(format(key), {
				path: path,
			});
		},
	},
};

function format(key: string) {
	return `proem:view:${sanitize(key)}`;
}

function sanitize(path: string) {
	return path.substring(0, path.indexOf("/"));
}
