"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { INTERNAL_COOKIE_NAME, User, useUser } from "@/app/hooks/use-user";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useOrganization as useClerkOrganisation } from "@clerk/nextjs";

export type TrackingInput = {
	region?: string;
	userAgent?: string;
};

export function useTrackingProfile(trackingInput?: TrackingInput) {
	const { user, isLoaded } = useUser();
	const organisation = useOrganization();

	if (!isLoaded) return {};

	const trackingProfile = getTrackingProfile(user, trackingInput);

	return { trackingProfile, user, organisation };
}

function useOrganization() {
	const { membership } = useClerkOrganisation();

	if (!membership) return undefined;

	const { organization } = membership;
	return {
		id: organization.id,
		name: organization.name,
	};
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

	if (user?.isInternal) {
		updateCookieIfNeeded(user);
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

function updateCookieIfNeeded(user: User) {
	const disabledByCookie = getCookie(INTERNAL_COOKIE_NAME);
	if (!disabledByCookie) {
		const { email, id: userId } = user;
		setCookie(INTERNAL_COOKIE_NAME, { email, userId });
		analyticsTrace("analytics cookie updated");
	}
}
