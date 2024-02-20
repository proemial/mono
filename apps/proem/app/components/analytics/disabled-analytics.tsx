"use client"

import { useAnalyticsDisabled } from "@/app/components/analytics/utils";

type AnalyticsIsDisabledByUserProps = {
	children: React.ReactNode;
};

export function AnalyticsIsEnabledByUser({ children }: AnalyticsIsDisabledByUserProps) {
  const analyticsIsDisabled = useAnalyticsDisabled();


	if (analyticsIsDisabled) {
		return null;
	}

	return children
}