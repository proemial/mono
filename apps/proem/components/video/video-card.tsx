"use client";

import { CarouselApi } from "@proemial/shadcn-ui";
import { VolumeMax, VolumeX } from "@untitled-ui/icons-react";
import { useState } from "react";
import ReactPlayer from "react-player";

type Props = {
	url: string;
	api: CarouselApi;
	snap: number;
};

export const VideoCard = ({ url, api, snap }: Props) => {
	const [muted, setMuted] = useState(true);

	if (!api) {
		return undefined;
	}

	return (
		<div
			className="relative rounded-2xl overflow-hidden cursor-pointer"
			onClick={() => setMuted(!muted)}
		>
			<ReactPlayer
				url={url}
				playing={api.selectedScrollSnap() === snap}
				width="100%"
				height="100%"
				pip={false}
				controls={false}
				playsinline={true}
				muted={muted}
				volume={1}
			/>
			<div className="absolute top-0 right-0 p-3 text-white">
				{muted ? (
					<VolumeX className="size-5" />
				) : (
					<VolumeMax className="size-5" />
				)}
			</div>
		</div>
	);
};
