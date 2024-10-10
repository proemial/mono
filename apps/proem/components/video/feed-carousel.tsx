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
				<VideoCarouselItem
					src="/videos/american-friendship-w4401124912.mp4"
					paperLink="/oa/W4401124912"
					api={api}
					isCurrent={current === 0}
					muted={muted}
					setMuted={setMuted}
				/>
				<VideoCarouselItem
					src="/videos/chubby-cheek-babies-w4400380733.mp4"
					paperLink="/oa/W4400380733"
					api={api}
					isCurrent={current === 1}
					muted={muted}
					setMuted={setMuted}
				/>
				<VideoCarouselItem
					src="/videos/covid-lockdowns-w4402349677.mp4"
					paperLink="/oa/W4402349677"
					api={api}
					isCurrent={current === 2}
					muted={muted}
					setMuted={setMuted}
				/>
				<VideoCarouselItem
					src="/videos/quitting-smoking-w4400000163.mp4"
					paperLink="/oa/W4400000163"
					api={api}
					isCurrent={current === 3}
					muted={muted}
					setMuted={setMuted}
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
