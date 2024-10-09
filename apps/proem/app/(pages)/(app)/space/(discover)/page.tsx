import { OnboardingCarousel } from "@/components/onboarding";
import FeaturedLink from "./featured-link";
import { staticItems } from "./random-static-item";
import { FeedCarousel } from "@/components/video/feed-carousel";

export default async function DiscoverPage() {
	return (
		<>
			<div className="sm:hidden flex flex-col">
				<FeedCarousel />
			</div>
			<div className="hidden sm:flex flex-col gap-2">
				<OnboardingCarousel />
				{staticItems.map((item, index) => (
					<FeaturedLink key={index} item={item} />
				))}
			</div>
		</>
	);
}
