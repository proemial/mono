import { OnboardingCarousel } from "@/components/onboarding";
import { Carousel, CarouselContent, CarouselItem } from "@proemial/shadcn-ui";
import FeaturedLink from "./featured-link";
import { staticItems } from "./random-static-item";

export default async function DiscoverPage() {
	return (
		<>
			<Carousel
				opts={{
					align: "start",
				}}
				orientation="vertical"
				className="sm:hidden flex flex-col"
			>
				<CarouselContent className="-mt-1 h-[calc(100dvh-72px)]">
					{staticItems.map((item, index) => (
						<CarouselItem key={index} className="py-1 basis-full">
							<FeaturedLink item={item} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className="hidden sm:flex flex-col gap-2">
				<OnboardingCarousel />
				{staticItems.map((item, index) => (
					<FeaturedLink key={index} item={item} />
				))}
			</div>
		</>
	);
}
