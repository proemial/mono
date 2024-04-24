import { AnalyticsClients } from "./analytics";
import { GaClient } from "./google/ga-client";
import { PostHogClient } from "./posthog/posthog-client";
import { VaClient } from "./vercel/va-client";

export const Analytics = {
    PostHog: PostHogClient,
    Vercel: VaClient,
    Google: GaClient,
    Clients: AnalyticsClients,
}