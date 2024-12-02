import { AnalyticsClients } from "./analytics";
import { PostHogClient } from "./posthog/posthog-client";
import { VaClient } from "./vercel/va-client";

export const Analytics = {
	PostHog: PostHogClient,
	Vercel: VaClient,
	Clients: AnalyticsClients,
};
