import DiscoverFeed from "@/app/(pages)/(app)/space/(discover)/discover-feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { Throbber } from "@/components/throbber";
import { Suspense } from "react";

export default async function DiscoverPage() {
	return (
		<div className="space-y-4">
			<OnboardingCarousel />
			<Suspense fallback={<Throbber />}>
				<DiscoverFeed />
			</Suspense>
		</div>
	);
}
