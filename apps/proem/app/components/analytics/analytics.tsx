import { AnalyticsIsEnabledByUser } from "@/app/components/analytics/disabled-analytics";
import { GaClient } from "@/app/components/analytics/ga-client";
import { VaClient } from "@/app/components/analytics/va-client";
import { headers } from "next/headers";

export function Analytics() {
	const userAgent = headers().get("user-agent");
	return (
		<AnalyticsIsEnabledByUser userAgent={userAgent}>
			<VaClient />
			<GaClient />
		</AnalyticsIsEnabledByUser>
	);
}
