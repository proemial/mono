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
					<CarouselItem className="py-1 basis-full hover:shadow overflow-hidden">
						{/* biome-ignore lint/a11y/useMediaCaption: don't care */}
						<video
							autoPlay
							// loop
							// muted
							playsInline
							id="video1"
							// src="/proem-vertical01.mp4"
							// src="/proem-horizontal01.mp4"
							src="/personalized01.mp4"
							className="pointer-events-none rounded-xl w-full h-full object-cover"
						/>
					</CarouselItem>
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
