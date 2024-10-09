"use client";

import { CarouselApi } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type Props = {
	url: string;
	api: CarouselApi;
	snap: number;
};

export const VideoCard = ({ url, api, snap }: Props) => {
	// const [muted, setMuted] = useState(true);

	// useEffect(() => {
	// 	if (api) {
	// 		if (api.selectedScrollSnap() === snap) {
	// 			setTimeout(() => {
	// 				setMuted(false);
	// 			}, 500);
	// 		} else {
	// 			setMuted(true);
	// 		}
	// 	}
	// });

	if (!api) {
		return undefined;
	}

	return (
		<div className="rounded-2xl overflow-hidden">
			<ReactPlayer
				url={url}
				playing={api.selectedScrollSnap() === snap}
				width="100%"
				height="100%"
				pip={false}
				controls={false}
				playsinline={true}
				muted={true}
				volume={1}
			/>
		</div>
	);
};
