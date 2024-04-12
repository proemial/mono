import { GaClient } from "./ga-client";
import { PostHogClient } from "./posthog-client";
import { VaClient } from "./va-client";

export const Analytics = {
    PostHog: PostHogClient,
    Vercel: VaClient,
    Google: GaClient,
}