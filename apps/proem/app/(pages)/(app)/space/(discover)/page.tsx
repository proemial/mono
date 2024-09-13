import DiscoverFeed from "@/app/(pages)/(app)/space/(discover)/discover-feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { Suspense } from "react";

export default async function DiscoverPage() {
	return (
		<div className="space-y-4">
			<OnboardingCarousel />
			<Suspense fallback={<h3>suspense loading...</h3>}>
				<DiscoverFeed />
			</Suspense>
		</div>
	);
}
