"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";

export type TrackingInput = {
	region?: string;
	userAgent?: string;
};

export function useTrackingProfile(trackingInput?: TrackingInput) {
	const trackingProfile = getTrackingProfile(trackingInput);

	return { trackingProfile };
}

export function getTrackingProfile(
	trackingInput?: TrackingInput,
): "disabled" | "anonymous" | "tracked" {
	const isBot =
		trackingInput?.userAgent && isChecklyBot(trackingInput?.userAgent);

	const props = `bot: ${isBot}`;
	const trace = (profile: string) =>
		analyticsTrace(`[tracking][${profile}] ${props}`);

	if (isBot) {
		trace("disabled");
		return "disabled";
	}

	trace("tracked");
	return "tracked";
}
export function usePathNames() {
	const pathname = usePathname();
	const trackingKey = analyticsKeys.viewName(pathname);

	return { pathname, trackingKey };
}

export function analyticsTrace(...data: unknown[]) {
	const enabled = getCookie("analyticsTrace");

	if (enabled) console.log(...data);
}

function isChecklyBot(userAgent: string) {
	return userAgent.includes("Checkly");
}
