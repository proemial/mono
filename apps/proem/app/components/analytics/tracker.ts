import va from "@vercel/analytics";
import ReactGA from "react-ga4";
import { analyticsTrace } from "@/app/components/analytics/utils";

export const Tracker = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    ReactGA.event(event, properties);
    analyticsTrace("[AnalyticsClient] track", event, properties);
  },
};
