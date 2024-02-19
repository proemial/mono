import { VaClient } from "@/app/components/analytics/va-client";
import { GaClient } from "@/app/components/analytics/ga-client";

export function AnalyticsClient() {
  return (
    <>
      <VaClient />
      <GaClient />
    </>
  );
}
