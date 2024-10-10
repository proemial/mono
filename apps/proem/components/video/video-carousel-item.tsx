"use client";

import { CarouselApi, CarouselItem } from "@proemial/shadcn-ui";
import { VolumeMax, VolumeX } from "@untitled-ui/icons-react";
import { MouseEvent, useState } from "react";
import ReactPlayer from "react-player";
import { Throbber } from "../throbber";
import { useRouter } from "next/navigation";

type Props = {
	src: string;
	paperLink: string;
	api: CarouselApi;
	/**
	 * The index of the item in the feed. Used for autoplay.
	 */
	index: number;
};

export const VideoCarouselItem = ({ src, paperLink, api, index }: Props) => {
	const [muted, setMuted] = useState(true);
	const router = useRouter();

	if (!api) {
		return undefined;
	}

	const handleMuteClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setMuted(!muted);
	};

	const handleVideoClick = () => {
		router.push(paperLink);
	};

	return (
		<CarouselItem className="py-1 rounded-2xl overflow-hidden">
			<div
				className="relative hover:shadow h-full w-full cursor-pointer rounded-2xl overflow-hidden"
				onClick={handleVideoClick}
			>
				<ReactPlayer
					url={src}
					playing={api.selectedScrollSnap() === index}
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
