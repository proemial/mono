"use client";

import { CarouselApi, CarouselItem } from "@proemial/shadcn-ui";
import { VolumeMax, VolumeX } from "@untitled-ui/icons-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Throbber } from "../throbber";

type Props = {
	url: string;
	api: CarouselApi;
	/**
	 * The index of the item in the feed.
	 */
	index: number;
};

export const VideoCarouselItem = ({ url, api, index }: Props) => {
	const [muted, setMuted] = useState(true);

	if (!api) {
		return undefined;
	}

	return (
		<CarouselItem className="py-1 rounded-2xl overflow-hidden">
			<div
				className="relative hover:shadow h-full w-full cursor-pointer rounded-2xl overflow-hidden"
				onClick={() => setMuted(!muted)}
			>
				<ReactPlayer
					url={url}
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
				<div className="absolute top-0 right-0 p-3 text-white">
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
