import {
	FeatureKey,
	FeatureValue,
	keyByValue,
} from "@/app/components/feature-flags/features";
import { currentUser } from "@clerk/nextjs";
import { Env } from "@proemial/utils/env";
import { PostHog } from "posthog-node";

const posthog = new PostHog(Env.get("NEXT_PUBLIC_POSTHOG_KEY"), {
	host: Env.get("NEXT_PUBLIC_POSTHOG_HOST"),
});

export async function getFeatureFlag(flag: FeatureValue) {
	const distinctID = await getDistinctID();

	if (!distinctID) {
		return false;
	}

	return posthog.isFeatureEnabled(flag, distinctID);
}

export async function getFeatureFlags(flags: FeatureValue[]) {
	const distinctID = await getDistinctID();

	if (!distinctID) {
		return Object.fromEntries(flags.map((f) => [keyByValue(f), false])) as {
			[key in FeatureKey]: boolean;
		};
	}

	const all = await posthog.getAllFlags(distinctID);

	return Object.fromEntries(flags.map((f) => [keyByValue(f), !!all[f]])) as {
		[key in FeatureKey]: boolean;
	};
}

async function getDistinctID() {
	const user = await currentUser();

	return user?.emailAddresses?.[0]?.emailAddress ?? user?.id;
}
