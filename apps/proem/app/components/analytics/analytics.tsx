import { AnalyticsIsEnabledByUser } from "@/app/components/analytics/disabled-analytics";
import { GaClient } from "@/app/components/analytics/ga-client";
import { VaClient } from "@/app/components/analytics/va-client";

export function Analytics() {
  return (
    <AnalyticsIsEnabledByUser>
      <VaClient />
      <GaClient />
    </AnalyticsIsEnabledByUser>
  );
}
