"use client";
import {
	analyticsTrace,
	usePathNames,
} from "@/components/analytics/tracking/tracking-profile";
import { env } from "@/env/client";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
import { Tracker } from "../tracking/tracker";

// https://www.npmjs.com/package/react-ga4
export function GaClient() {
	analyticsTrace("[GaClient]");

	const initialized = useInit();
	const { pathname, trackingKey } = usePathNames();

	useEffect(() => {
		if (initialized) {
			Tracker.trackPage.google(trackingKey, pathname);
		}
	}, [initialized, pathname, trackingKey]);

	return <></>;
}

function useInit() {
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (!initialized) {
			analyticsTrace("[GaClient] GA initializing");
			// const email = user?.primaryEmailAddress?.emailAddress as string;
			ReactGA.initialize(env.NEXT_PUBLIC_GA_ID);

			analyticsTrace("[GaClient] GTM initializing");
			TagManager.initialize({
				gtmId: "GTM-TCS63KTV",
			});
			setInitialized(true);
		}
	});

	return initialized;
}
