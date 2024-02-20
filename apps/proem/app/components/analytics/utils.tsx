"use client";
import { useUser } from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type UserAgent = string;
export type useAnalyticsDisabledProps = {
  userAgent: UserAgent | null
}

export function useAnalyticsDisabled({ userAgent }: useAnalyticsDisabledProps) {
  const { user } = useUser();
  const isBot = userAgent && isChecklyBot(userAgent);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const isEmployee = email.endsWith("@proemial.ai");
  const disabledByCookie = getCookie("analyticsDisabled");


  // Deleting the cookie must be done manually
  if ((isEmployee) && !disabledByCookie) {
    setCookie("analyticsDisabled", "true");
    analyticsTrace("analytics cookie updated");
  }

  const isDisabled = Boolean(isEmployee || disabledByCookie || isBot);

  analyticsTrace(
    `AnalyticsDisabled: ${isDisabled} (${isEmployee}, ${disabledByCookie})`,
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

function isChecklyBot(userAgent: UserAgent) {
  return userAgent.includes("Checkly");
}