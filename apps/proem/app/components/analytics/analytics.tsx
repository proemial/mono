"use client";
import { Analytics } from "@/app/components/analytics";
import {
	TrackingInput,
	useTrackingProfile,
} from "@/app/components/analytics/tracking/tracking-profile";

export function AnalyticsClients({ tracking }: { tracking?: TrackingInput }) {
	const { trackingProfile } = useTrackingProfile(tracking);

	return (
		<>
			{trackingProfile !== "disabled" && <Analytics.Vercel />}

			{trackingProfile === "tracked" && <Analytics.Google />}
		</>
	);
}
