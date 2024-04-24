"use client";
import { Analytics } from "@/app/components/analytics";
import { TrackingInput, useTrackingProfile } from "@/app/components/analytics/tracking/tracking-profile";

export function AnalyticsClients({ tracking }: { tracking?: TrackingInput }) {
    const { trackingProfile } = useTrackingProfile(tracking);

    // Only enabled for registered users or non-eu citizens
    if (trackingProfile !== "tracked") return null;

    return (
        <>
            <Analytics.Vercel tracking={tracking} />
            <Analytics.Google tracking={tracking} />
        </>
    );
}