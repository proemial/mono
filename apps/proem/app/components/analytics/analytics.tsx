import { VaClient } from "@/app/components/analytics/va-client";
import { SentryClient } from "@/app/components/analytics/sentry-client";
import { GaClient } from "@/app/components/analytics/ga-client";

export function AnalyticsClient() {
  return (
    <>
      <VaClient />
      <SentryClient />
      <GaClient />
    </>
  );
}
