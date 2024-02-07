"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Env } from "@proemial/utils/env";
import process from "process";
import {
  analyticsTrace,
  useAnalyticsDisabled,
  usePathNames,
} from "@/app/components/analytics/utils";

// https://www.npmjs.com/package/react-ga4
export function GaClient() {
  analyticsTrace("[GaClient]");

  const disabled = useAnalyticsDisabled();
  const initialized = useInit(disabled);
  const { pathname, viewName } = usePathNames();

  useEffect(() => {
    if (initialized) {
      analyticsTrace("[GaClient] trackPage:", `${viewName}:view`, pathname);
      ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
      ReactGA.event(`view:${viewName}`, {
        path: pathname,
      });
    }
  }, [initialized, pathname]);

  return <></>;
}

function useInit(disabled: boolean) {
  const { user } = useUser();
  const [initialized, setInitialized] = useState(false);

  analyticsTrace("[GaClient] useInit");

  useEffect(() => {
    if (user && !disabled) {
      analyticsTrace("[GaClient] initializing");
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
