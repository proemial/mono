import va from "@vercel/analytics";
import ReactGA from "react-ga4";

export const Tracker = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    ReactGA.event(event, properties);
    console.log("[AnalyticsClient] track", event, properties);
  },
};
