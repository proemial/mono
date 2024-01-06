"use client";
import { useEffect, useState } from "react";
import { Env } from "@proemial/utils/env";
import * as Sentry from "@sentry/nextjs";
import process from "process";

export function SentryClient() {
  const [initialized, setInitialized] = useState(false);
  console.log("[SentryClient]");

  useEffect(() => {
    if (!initialized && Env.isProd) {
      console.log("[SentryClient] init");
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

      setInitialized(true);
    }
  }, [setInitialized]);

  return <></>;
}
