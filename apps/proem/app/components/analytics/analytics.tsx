import { GaClient } from "@/app/components/analytics/ga-client";
import { VaClient } from "@/app/components/analytics/va-client";

export type AnalyticsClientProps = {
  isBot?: boolean
}

export function AnalyticsClient({ isBot }: AnalyticsClientProps) {
  return (
    <>
      <VaClient isBot={isBot} />
      <GaClient />
    </>
  );
}
