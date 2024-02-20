import {
	FeatureKey,
	FeatureValue,
	keyByValue,
} from "@/app/components/feature-flags/features";
import posthog from "posthog-js";

export function useFeatureFlag(flag: FeatureValue) {
	return posthog.isFeatureEnabled(flag);
}

export function useFeatureFlags(flags: FeatureValue[]) {
	const all = Object.fromEntries(
		posthog.featureFlags
			.getFlags()
			.map((f) => [keyByValue(f as FeatureValue), false]),
	);

	return Object.fromEntries(flags.map((f) => [keyByValue(f), !!all[f]])) as {
		[key in FeatureKey]: boolean;
	};
}
