"use client";
import { useUser } from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

export function useAnalyticsDisabled() {
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || "";
  const isEmployee = email.endsWith("@proemial.ai");
  const explicitDisabled = user?.publicMetadata?.analyticsDisabled;
  const disabledByCookie = getCookie("analyticsDisabled");

  // Deleting the cookie must be done manually
  if ((isEmployee || explicitDisabled) && !disabledByCookie) {
    setCookie("analyticsDisabled", "true");
    analyticsTrace("analytics cookie updated");
  }

  const isDisabled = !!(isEmployee || explicitDisabled || disabledByCookie);

  analyticsTrace(
    `AnalyticsDisabled: ${isDisabled} (${isEmployee}, ${explicitDisabled}, ${disabledByCookie})`,
  );

  return isDisabled;
}

export function usePathNames() {
  const pathname = usePathname();
  const trackingKey = analyticsKeys.viewName(pathname);

  return { pathname, trackingKey };
}

export function analyticsTrace(...data: any[]) {
  const enabled = getCookie("analyticsTrace");

  if (enabled) console.log(...data);
}
