"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { useUser } from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";

const INTERNAL_COOIKE_NAME = "isInternalUser";

type UserAgent = string;

export type useAnalyticsDisabledProps = {
	userAgent: UserAgent | null;
};

export function useAnalyticsDisabled({ userAgent }: useAnalyticsDisabledProps) {
	const { user } = useUser();
	const isBot = userAgent && isChecklyBot(userAgent);

	const email = user?.primaryEmailAddress?.emailAddress ?? "";
	const isInternal = email.endsWith("@proemial.ai");
	const disabledByCookie = getCookie(INTERNAL_COOIKE_NAME);

	// Deleting the cookie must be done manually
	if (isInternal && !disabledByCookie) {
		setCookie(INTERNAL_COOIKE_NAME, "true");
		analyticsTrace("analytics cookie updated");
	}

	const isDisabled = Boolean(isInternal || disabledByCookie || isBot);

	analyticsTrace(
		`AnalyticsDisabled: ${isDisabled} (${isInternal}, ${disabledByCookie})`,
	);

	return isDisabled;
}

export function usePathNames() {
	const pathname = usePathname();
	const trackingKey = analyticsKeys.viewName(pathname);

	return { pathname, trackingKey };
}

export function analyticsTrace(...data: any[]) {
	const enabled = getCookie("analyticsTrace");

	if (enabled) console.log(...data);
}

function isChecklyBot(userAgent: UserAgent) {
	return userAgent.includes("Checkly");
}
