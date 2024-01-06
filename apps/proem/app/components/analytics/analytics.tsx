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
import { setCookie, getCookie } from "cookies-next";

// https://www.npmjs.com/package/react-ga4
// https://vercel.com/docs/concepts/analytics/custom-events

export function AnalyticsClient() {
  console.log("[AnalyticsClient]");
  const disabled = useAnalyticsDisabled();
  const { pathname, viewName } = usePathNames();
  const gaInitialized = useGoogleAnalytics(disabled);

  useEffect(() => {
    if (gaInitialized) {
      console.log(
        "[AnalyticsClient] ga.trackPage:",
        `view:${viewName}`,
        pathname,
      );
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
      Tracker.track(`view:${viewName}`, {
        path: pathname,
      });
    }
  }, [gaInitialized, pathname]);

  if (disabled) return <></>;

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}

export const Tracker = {
  track: (event: string, properties?: Record<string, any>) => {
    va.track(event, properties);

    ReactGA.event(event, properties);
    console.log("[AnalyticsClient] track", event, properties);
  },
};

function useGoogleAnalytics(disabled: boolean) {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  console.log("[AnalyticsClient] ga");

  useEffect(() => {
    if (user && !disabled) {
      console.log("[AnalyticsClient] ga.init");
      // const email = user?.primaryEmailAddress?.emailAddress as string;
      ReactGA.initialize(
        Env.validate("NEXT_PUBLIC_GA_ID", process.env.NEXT_PUBLIC_GA_ID),
        {
          gaOptions: {
            userId: user.id,
          },
        },
      );

      setInitialized(true);
    }
  }, [setInitialized, user, disabled]);

  return initialized;
}

function useAnalyticsDisabled() {
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || "";
  const isEmployee = email.endsWith("@proemial.ai");
  const explicitDisabled = user?.publicMetadata?.analyticsDisabled;
  const disabledByCookie = getCookie("analyticsDisabled");

  // Deleting the cookie must be done manually
  if ((isEmployee || explicitDisabled) && !disabledByCookie) {
    setCookie("analyticsDisabled", "true");
    console.log("analytics cookie updated");
  }

  const isDisabled = !!(isEmployee || explicitDisabled || disabledByCookie);

  console.log(
    `AnalyticsDisabled: ${isDisabled} (${isEmployee}, ${explicitDisabled}, ${disabledByCookie})`,
  );

  return isDisabled;
}

function usePathNames() {
  const pathname = usePathname();

  const getViewName = (path: string) => {
    if (path === "/") return "home";
    if (path.startsWith("/oa")) return "reader";
    return path.slice(1);
  };

  return { pathname, viewName: getViewName(pathname) };
}
