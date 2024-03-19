"use client";
import { analyticsTrace, usePathNames } from "@/app/components/analytics/utils";
import { useUser } from "@clerk/nextjs";
import process from "process";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

// https://www.npmjs.com/package/react-ga4
export function GaClient() {
	analyticsTrace("[GaClient]");

	const initialized = useInit();
	const { pathname, trackingKey } = usePathNames();

	useEffect(() => {
		if (initialized) {
			analyticsTrace("[GaClient] trackPage:", trackingKey, pathname);
			ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
			ReactGA.event(trackingKey, {
				path: pathname,
			});
		}
	}, [initialized, pathname]);

	return <></>;
}

function useInit() {
	const { user } = useUser();
	const [initialized, setInitialized] = useState(false);

	analyticsTrace("[GaClient] useInit");

	useEffect(() => {
		if (user) {
			analyticsTrace("[GaClient] initializing");
			// const email = user?.primaryEmailAddress?.emailAddress as string;
			ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID, {
				gaOptions: {
					userId: user.id,
				},
			});

			setInitialized(true);
		}
	}, [setInitialized, user]);

	return initialized;
}
