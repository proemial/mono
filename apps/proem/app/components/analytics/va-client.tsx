"use client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import va from "@vercel/analytics";
import { useEffect } from "react";
import {
  useAnalyticsDisabled,
  usePathNames,
} from "@/app/components/analytics/utils";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient() {
  console.log("[VaClient]");
  const disabled = useAnalyticsDisabled();
  const { pathname, viewName } = usePathNames();

  useEffect(() => {
    if (!disabled) {
      console.log("[VaClient] trackPage:", `view:${viewName}`, pathname);
      va.track(`view:${viewName}`, {
        path: pathname,
      });
    }
  }, [pathname, disabled]);

  if (disabled) return <></>;

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}
