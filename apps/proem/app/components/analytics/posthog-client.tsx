"use client";
import { useUser } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { analyticsTrace } from "@/app/components/analytics/utils";
import { Env } from "@proemial/utils/env";
import process from "process";

// https://posthog.com/tutorials/cookieless-tracking
export function PostHogClient({ children }: { children: ReactNode }) {
  analyticsTrace("[PosthogClient]");
  const initialized = useInit();

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

function useInit() {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  analyticsTrace("[PosthogClient] useInit");
  useEffect(() => {
    const persistence = user ? undefined : "memory";
    const distinctID = user?.primaryEmailAddress?.emailAddress || user?.id;
    console.log("distinctID", distinctID);

    const token = Env.validate(
      "NEXT_PUBLIC_POSTHOG_KEY",
      process.env.NEXT_PUBLIC_POSTHOG_KEY,
    );
    const api_host = Env.validate(
      "NEXT_PUBLIC_POSTHOG_HOST",
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
    );

    analyticsTrace("[PosthogClient] initializing", persistence, distinctID);
    const result = posthog.init(token, {
      api_host,
      persistence,
      bootstrap: {
        distinctID,
      },
    });
  }, [setInitialized, user]);

  return initialized;
}
