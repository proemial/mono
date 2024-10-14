"use client";

import { Carousel, CarouselApi, CarouselContent } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import { VideoCarouselItem } from "./video-carousel-item";
import { staticVideos } from "./static-videos";

export const VideoCarousel = () => {
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
						isMuted={muted}
						toggleMuted={() => setMuted(!muted)}
					/>
				))}
			</CarouselContent>
		</Carousel>
	);
};
