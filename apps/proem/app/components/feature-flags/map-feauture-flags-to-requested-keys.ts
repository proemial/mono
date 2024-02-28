import { FeatureKey, Features } from "@/app/components/feature-flags/features";

export function mapFeatureFlagsToRequestedKeys<T extends FeatureKey>(
	flags: T[],
	allFlags: Record<string, string | boolean>,
) {
	return Object.fromEntries(
		flags.map((f) => [f, Boolean(allFlags[Features[f]])]),
	) as Record<T, boolean>;
}
