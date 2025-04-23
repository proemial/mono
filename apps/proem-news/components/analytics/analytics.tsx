"use client";
import { Analytics } from "@/components/analytics";
import {
	TrackingInput,
	useTrackingProfile,
} from "@/components/analytics/tracking/tracking-profile";

export function AnalyticsClients({ tracking }: { tracking?: TrackingInput }) {
	const { trackingProfile } = useTrackingProfile(tracking);

	return <>{trackingProfile !== "disabled" && <Analytics.Vercel />}</>;
}
