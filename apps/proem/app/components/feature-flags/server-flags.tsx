import { Env } from "@proemial/utils/env";
import { PostHog } from "posthog-node";
import { currentUser } from "@clerk/nextjs";
import { Features } from "@/app/components/feature-flags/features";

const posthog = new PostHog(Env.get("NEXT_PUBLIC_POSTHOG_KEY"), {
  host: Env.get("NEXT_PUBLIC_POSTHOG_HOST"),
});

export async function getFeatureFlag(flag: Features) {
  const user = await currentUser();
  const distinctID = user?.emailAddresses?.length
    ? user?.emailAddresses[0]?.emailAddress
    : user?.id;

  if (!distinctID) {
    return false;
  }

  return posthog.isFeatureEnabled(flag, distinctID);
}

export async function getFeatureFlags(flags: Features[]) {
  const all = await posthog.getAllFlags("brian@proemial.ai");

  return Object.fromEntries(flags.map((f) => [f, !!all[f]]));
}
