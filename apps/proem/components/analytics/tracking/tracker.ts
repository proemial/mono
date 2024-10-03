import { TrackingKey } from "@/components/analytics/tracking/tracking-keys";
import { analyticsTrace } from "@/components/analytics/tracking/tracking-profile";
import va from "@vercel/analytics";
import posthog from "posthog-js";
import ReactGA from "react-ga4";

export const Tracker = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	track: (event: TrackingKey, properties?: Record<string, any>) => {
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
	const sanitized = sanitize(key);
	const formatted = sanitized
		? `proem:view:${sanitized}`
		: // analyticsKeys.viewName always adds ":view", but we don't want e.g.
			// ":proem:view:space:view", so we remove the trailing ":view", when
			// sanitized is ""
			`proem:view:${key.replace(":view", "")}`;
	return formatted;
}

function sanitize(path: string) {
	if (path.includes("inspect")) return "inspect";
	if (path.includes("paper")) return "paper";
	if (path.includes("search")) return "search";
	return path.substring(0, path.indexOf("/"));
}
