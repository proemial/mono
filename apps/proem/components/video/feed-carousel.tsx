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
				<VideoCarouselItem
					src="/videos/american-friendship.mp4"
					paperLink="https://proem.ai/paper/oa/W4401124912"
					api={api}
					index={0}
				/>
				<VideoCarouselItem
					src="/videos/chubby-cheek-babies.mp4"
					paperLink="https://proem.ai/paper/oa/W4400380733"
					api={api}
					index={1}
				/>
				<VideoCarouselItem
					src="/videos/covid-lockdowns.mp4"
					paperLink="https://proem.ai/paper/oa/W4402349677"
					api={api}
					index={2}
				/>
				{/* {staticItems.map((item, index) => (
					<CarouselItem key={index} className="py-1">
						<FeaturedLink item={item} />
					</CarouselItem>
				))} */}
			</CarouselContent>
		</Carousel>
	);
};
