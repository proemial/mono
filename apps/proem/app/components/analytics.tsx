"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import va from "@vercel/analytics";
import ReactGA from "react-ga4";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Env } from "@proemial/utils/env";
import * as process from "process";
import * as Sentry from "@sentry/nextjs";

// https://www.npmjs.com/package/react-ga4
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
  const pathname = usePathname();
  const initialized = useGoogleAnalytics();
  useSentry();

  const getViewName = (path: string) => {
    if (path === "/") return "home";
    if (path.startsWith("/oa")) return "reader";
    return path.slice(1);
  };

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
      console.log("[AnalyticsClient] ", `view:${getViewName(pathname)}`);
      Analytics.track(`view:${getViewName(pathname)}`, {
        path: pathname,
      });
    }
  }, [initialized, pathname]);

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}

export const Analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    ReactGA.event(event, properties);
    console.log("[AnalyticsClient] event:", event, properties);
  },
};

function useGoogleAnalytics() {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      // const email = user?.primaryEmailAddress?.emailAddress as string;
      ReactGA.initialize(
        Env.validate("NEXT_PUBLIC_GA_ID", process.env.NEXT_PUBLIC_GA_ID),
        {
          gaOptions: {
            userId: user.id,
          },
        },
      );
      console.log("[GA] init");

      setInitialized(true);
    }
  }, [setInitialized, user]);

  return initialized;
}

function useSentry() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && Env.isProd) {
      Sentry.init({
        dsn: Env.validate(
          "NEXT_PUBLIC_SENTRY_DSN",
          process.env.NEXT_PUBLIC_SENTRY_DSN,
        ),
        integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });
      console.log("[Sentry] init");

      setInitialized(true);
    }
  }, [setInitialized]);

  return initialized;
}
