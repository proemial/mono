import {
	FeatureKey,
	FeatureValue,
} from "@/app/components/feature-flags/features";
import { mapFeatureFlagsToRequestedKeys } from "@/app/components/feature-flags/map-feauture-flags-to-requested-keys";
import { posthog } from "@/app/components/feature-flags/post-hog-client";
import { currentUser } from "@clerk/nextjs";
import { cache } from "react";

const getAllFlagsCached = cache(
	async (...parameters: Parameters<typeof posthog.getAllFlags>) => {
		const allFlags = await posthog.getAllFlags(...parameters);
		return allFlags;
	},
);

const currentUserCached = cache(currentUser);

export async function getFeatureFlag(flag: FeatureValue) {
	const distinctID = await getDistinctID();

	if (!distinctID) {
		return false;
	}

	return posthog.isFeatureEnabled(flag, distinctID);
}

export async function getFeatureFlags<T extends FeatureKey>(
	flags: T[],
): Promise<Record<T, boolean>> {
	const distinctID = await getDistinctID();
	const allFlags = distinctID ? await getAllFlagsCached(distinctID) : {};

	return mapFeatureFlagsToRequestedKeys(flags, allFlags);
}

async function getDistinctID() {
	const user = await currentUserCached();

	return user?.emailAddresses?.[0]?.emailAddress ?? user?.id;
}
