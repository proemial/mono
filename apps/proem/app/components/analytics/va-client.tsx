"use client";
import { AnalyticsClientProps } from "@/app/components/analytics/analytics";
import {
  analyticsTrace,
  usePathNames
} from "@/app/components/analytics/utils";
import va from "@vercel/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient({ isBot }: AnalyticsClientProps) {
  analyticsTrace("[VaClient]");

  const { pathname, trackingKey } = usePathNames();

  useEffect(() => {
      analyticsTrace("[VaClient] trackPage:", trackingKey, pathname);
      va.track(trackingKey, {
        path: pathname,
      });
  }, [pathname]);

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}
