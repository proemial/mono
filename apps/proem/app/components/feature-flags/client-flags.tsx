import {
	FeatureKey,
	FeatureValue,
} from "@/app/components/feature-flags/features";
import { mapFeatureFlagsToRequestedKeys } from "@/app/components/feature-flags/map-feauture-flags-to-requested-keys";
import posthog from "posthog-js";
import { useActiveFeatureFlags } from "posthog-js/react";

export function useFeatureFlag(flag: FeatureValue) {
	return posthog.isFeatureEnabled(flag);
}

/**
 * useFeatureFlagsis returns feature flags for the current user.
 * It does not work on the server, where every flag is false so use getFeatureFlags instead.
 * @see {@link: getFeatureFlags}
 */
export function useFeatureFlags<T extends FeatureKey>(flags: T[]) {
	const allActiveFlagsKeys = useActiveFeatureFlags();
	const allFlags = Object.fromEntries(
		allActiveFlagsKeys?.map((f) => [f, true]) ?? [],
	);

	return mapFeatureFlagsToRequestedKeys(flags, allFlags);
}
