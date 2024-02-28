import { Env } from "@proemial/utils/env";
import { PostHog } from "posthog-node";

export const posthog = new PostHog(Env.get("NEXT_PUBLIC_POSTHOG_KEY"), {
	host: Env.get("NEXT_PUBLIC_POSTHOG_HOST"),
});
