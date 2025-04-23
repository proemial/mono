"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";

export type User = {
	fullName: string;
	initials: string;
	email: string;
	avatar: string;
	id?: string;
	isInternal?: boolean;
};

export type TrackingInput = {
	region?: string;
	userAgent?: string;
};

export function useTrackingProfile(trackingInput?: TrackingInput) {
	const user = undefined;
	const trackingProfile = getTrackingProfile(user, trackingInput);

	return { trackingProfile, user, organisation: undefined };
}

export function getTrackingProfile(
	user?: User,
	trackingInput?: TrackingInput,
): "disabled" | "anonymous" | "tracked" {
	const isBot =
		trackingInput?.userAgent && isChecklyBot(trackingInput?.userAgent);
	const internal = user?.isInternal;
	const registered = !!user;

	const props = `registered: ${registered}, bot: ${isBot}, internal: ${internal}`;
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
