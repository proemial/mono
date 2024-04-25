"use client";
import {
	TrackingInput,
	analyticsTrace,
	usePathNames,
} from "@/app/components/analytics/tracking/tracking-profile";
import { useUser } from "@clerk/nextjs";
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
	const { user } = useUser();
	const [initialized, setInitialized] = useState(false);

	analyticsTrace("[GaClient] useInit");

	useEffect(() => {
		if (user) {
			analyticsTrace("[GaClient] GA initializing");
			// const email = user?.primaryEmailAddress?.emailAddress as string;
			ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID, {
				gaOptions: {
					userId: user.id,
				},
			});

			analyticsTrace("[GaClient] GTM initializing");
			TagManager.initialize({
				gtmId: "GTM-TCS63KTV",
				dataLayer: {
					userId: user.id,
				},
			});
			setInitialized(true);
		}
	}, [user]);

	return initialized;
}
