import { OnboardingCarousel } from "@/components/onboarding";
import { ProemCarousel } from "@/components/video/proem-carousel";
import FeaturedLink from "./featured-link";
import { staticItems } from "./random-static-item";

export default async function DiscoverPage() {
	return (
		<>
			<ProemCarousel />
			<div className="hidden sm:flex flex-col gap-2">
				<OnboardingCarousel />
				{staticItems.map((item, index) => (
					<FeaturedLink key={index} item={item} />
				))}
			</div>
		</>
	);
}
