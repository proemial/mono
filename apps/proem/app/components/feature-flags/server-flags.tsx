import {
  FeatureValue,
  Features,
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

export async function getFeatureFlags<T extends keyof Features>(flags: T[]) {
  const distinctID = await getDistinctID();
  if (!distinctID) {
    return Object.fromEntries(flags.map((flag) => [flag, false])) as {
      [key in T]: boolean;
    };
  }

  const all = await posthog.getAllFlags(distinctID);

  return Object.fromEntries(flags.map((f) => [f, !!all[f]])) as {
    [key in T]: boolean;
  };
}

async function getDistinctID() {
  const user = await currentUser();

  return user?.emailAddresses?.[0]?.emailAddress ?? user?.id;
}
