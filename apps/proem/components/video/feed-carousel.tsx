"use client";

import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import { VideoCarouselItem } from "./video-carousel-item";
import FeaturedLink from "@/app/(pages)/(app)/space/(discover)/featured-link";
import { staticItems } from "@/app/(pages)/(app)/space/(discover)/random-static-item";

export const FeedCarousel = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		// TODO: Figure out why this is needed to get autoplay working
		api.on("settle", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<Carousel
			opts={{
				align: "start",
			}}
			orientation="vertical"
			setApi={setApi}
		>
			<CarouselContent className="-mt-1 h-[calc(100dvh-72px)]">
				<VideoCarouselItem url="/personalized01.mp4" api={api} index={0} />
				<CarouselItem className="py-1">
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					<FeaturedLink item={staticItems[0]!} />
				</CarouselItem>
				<VideoCarouselItem url="/short01.mp4" api={api} index={2} />
				<CarouselItem className="py-1">
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					<FeaturedLink item={staticItems[1]!} />
				</CarouselItem>
				<VideoCarouselItem url="/chubby01.mp4" api={api} index={4} />
				{staticItems.slice(2).map((item, index) => (
					<CarouselItem key={index} className="py-1">
						<FeaturedLink item={item} />
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
