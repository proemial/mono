"use client";
import { analyticsTrace } from "@/app/components/analytics/utils";
import { useUser } from "@clerk/nextjs";
import { Env } from "@proemial/utils/env";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import process from "process";
import { ReactNode, useEffect, useState } from "react";

// https://posthog.com/tutorials/cookieless-tracking
export function PostHogClient({ children }: { children: ReactNode }) {
	analyticsTrace("[PosthogClient]");
	useInit();

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

function useInit() {
	const { user } = useUser();
	const [initialized, setInitialized] = useState(false);

	analyticsTrace("[PosthogClient] useInit");
	useEffect(() => {
		const persistence = user ? undefined : "memory";
		const distinctID = user?.primaryEmailAddress?.emailAddress || user?.id;

		const token = Env.validate(
			"NEXT_PUBLIC_POSTHOG_KEY",
			process.env.NEXT_PUBLIC_POSTHOG_KEY,
		);
		const api_host = Env.validate(
			"NEXT_PUBLIC_POSTHOG_HOST",
			process.env.NEXT_PUBLIC_POSTHOG_HOST,
		);

		analyticsTrace("[PosthogClient] initializing", persistence, distinctID);
		posthog.init(token, {
			api_host,
			persistence,
			bootstrap: {
				distinctID,
			},
		});
		setInitialized(true);
	}, [setInitialized, user]);

	return initialized;
}
