"use client";

import { CarouselApi, CarouselItem } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { VideoItem, VideoItemProps } from "./video-item";

type Props = {
	src: string;
	paperLink: string;
	api: CarouselApi;
	isCurrent: boolean;
	isMuted: VideoItemProps["isMuted"];
	toggleMuted: VideoItemProps["toggleMuted"];
};

export const VideoCarouselItem = ({
	src,
	paperLink,
	api,
	isCurrent,
	isMuted,
	toggleMuted,
}: Props) => {
	const [playing, setPlaying] = useState(false);
	const paperId = paperLink.split("/").pop() ?? "";

	useEffect(() => {
		if (api && isCurrent) {
			setPlaying(true);
			trackHandler(analyticsKeys.feed.videoCard.play, { paperId })();
		} else {
			setPlaying(false);
		}
	}, [api, isCurrent, paperId]);

	if (!api) {
		return undefined;
	}

	return (
		<CarouselItem className="py-1 rounded-2xl overflow-hidden">
			<VideoItem
				src={src}
				paperLink={paperLink}
				isMuted={isMuted}
				toggleMuted={toggleMuted}
				playing={playing}
			/>
		</CarouselItem>
	);
};
