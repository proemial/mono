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
import { staticVideos } from "./static-videos";

export const FeedCarousel = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [muted, setMuted] = useState(true);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		api.on("settle", () => {
			setCurrent(api.selectedScrollSnap());
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
				{staticVideos.map((video, index) => (
					<VideoCarouselItem
						key={index}
						src={video.src}
						paperLink={video.paperLink}
						api={api}
						isCurrent={current === index}
						muted={muted}
						setMuted={setMuted}
					/>
				))}
				{/* {staticItems.map((item, index) => (
					<CarouselItem key={index} className="py-1">
						<FeaturedLink item={item} />
					</CarouselItem>
				))} */}
			</CarouselContent>
		</Carousel>
	);
};
