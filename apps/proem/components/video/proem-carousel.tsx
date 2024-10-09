"use client";

import FeaturedLink from "@/app/(pages)/(app)/space/(discover)/featured-link";
import { staticItems } from "@/app/(pages)/(app)/space/(discover)/random-static-item";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import { VideoCard } from "./video-card";

export const ProemCarousel = () => {
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
			className="sm:hidden flex flex-col"
			setApi={setApi}
		>
			<CarouselContent className="-mt-1 h-[calc(100dvh-72px)]">
				<CarouselItem className="py-1 basis-full">
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					<FeaturedLink item={staticItems[0]!} />
				</CarouselItem>
				<CarouselItem className="py-1 basis-full overflow-hidden rounded-2xl">
					<VideoCard url="/personalized01.mp4" api={api} snap={1} />
				</CarouselItem>
				<CarouselItem className="py-1 basis-full overflow-hidden rounded-2xl">
					<VideoCard url="/chubby01.mp4" api={api} snap={2} />
				</CarouselItem>
				{staticItems.slice(2).map((item, index) => (
					<CarouselItem key={index} className="py-1 basis-full">
						<FeaturedLink item={item} />
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
