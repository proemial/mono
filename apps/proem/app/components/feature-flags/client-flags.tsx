import posthog from "posthog-js";
import { Features } from "@/app/components/feature-flags/features";

export function useFeatureFlag(flag: Features) {
  return posthog.isFeatureEnabled(flag);
}

// export function useFeatureFlags() {
//     return posthog.featureFlags.getFlags();
// }
