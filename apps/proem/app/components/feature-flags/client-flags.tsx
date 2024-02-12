import posthog from "posthog-js";
import {
  keyByValue,
  FeatureKey,
  FeatureValue,
} from "@/app/components/feature-flags/features";

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
