"use client";

import {
	useAnalyticsDisabled,
	useAnalyticsDisabledProps,
} from "@/app/components/analytics/utils";

type AnalyticsIsDisabledByUserProps = useAnalyticsDisabledProps & {
	children: React.ReactNode;
};

export function AnalyticsIsEnabledByUser({
	children,
	userAgent,
}: AnalyticsIsDisabledByUserProps) {
	const analyticsIsDisabled = useAnalyticsDisabled({ userAgent });

	if (analyticsIsDisabled) {
		return null;
	}

	return children;
}
