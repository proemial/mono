"use client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import va from "@vercel/analytics";
import { useEffect } from "react";
import {
  analyticsTrace,
  useAnalyticsDisabled,
  usePathNames,
} from "@/app/components/analytics/utils";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient() {
  analyticsTrace("[VaClient]");

  const disabled = useAnalyticsDisabled();
  const { pathname, trackingKey } = usePathNames();

  useEffect(() => {
    if (!disabled) {
      analyticsTrace("[VaClient] trackPage:", trackingKey, pathname);
      va.track(trackingKey, {
        path: pathname,
      });
    }
  }, [pathname, disabled]);

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}
