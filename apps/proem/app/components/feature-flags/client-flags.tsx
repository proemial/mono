import posthog from "posthog-js";
import { FeatureValue } from "@/app/components/feature-flags/features";

export function useFeatureFlag(flag: FeatureValue) {
  return posthog.isFeatureEnabled(flag);
}

// export function useFeatureFlags() {
//     return posthog.featureFlags.getFlags();
// }
