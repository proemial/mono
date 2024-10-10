"use client";

import { CarouselApi, CarouselItem } from "@proemial/shadcn-ui";
import { VolumeMax, VolumeX } from "@untitled-ui/icons-react";
import { MouseEvent, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Throbber } from "../throbber";
import { useRouter } from "next/navigation";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { routes } from "@/routes";

type Props = {
	src: string;
	paperLink: string;
	api: CarouselApi;
	isCurrent: boolean;
	muted: boolean;
	setMuted: (muted: boolean) => void;
};

export const VideoCarouselItem = ({
	src,
	paperLink,
	api,
	isCurrent,
	muted,
	setMuted,
}: Props) => {
	const [playing, setPlaying] = useState(false);
	const router = useRouter();
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

	const handleMuteClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		if (muted) {
			trackHandler(analyticsKeys.feed.videoCard.unmute, { paperId })();
		} else {
			trackHandler(analyticsKeys.feed.videoCard.mute, { paperId })();
		}
		setMuted(!muted);
	};

	const handleVideoClick = () => {
		trackHandler(analyticsKeys.feed.videoCard.click, { paperId })();
		router.push(`${routes.paper}/${paperLink}`);
	};

	return (
		<CarouselItem className="py-1 rounded-2xl overflow-hidden">
			<div
				className="relative hover:shadow h-full w-full cursor-pointer rounded-2xl overflow-hidden"
				onClick={handleVideoClick}
			>
				<ReactPlayer
					url={src}
					playing={playing}
					width="100%"
					height="100%"
					pip={false}
					controls={false}
					playsinline={true}
					muted={muted}
					volume={1}
					fallback={<Throbber />}
					config={{
						file: {
							attributes: {
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover",
								},
							},
						},
					}}
				/>
				<div
					className="absolute top-0 right-0 m-1 p-4 text-white hover:bg-white/10 rounded-full"
					onClick={handleMuteClick}
				>
					{muted ? (
						<VolumeX className="size-5" />
					) : (
						<VolumeMax className="size-5" />
					)}
				</div>
			</div>
		</CarouselItem>
	);
};
