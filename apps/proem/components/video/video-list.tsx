"use client";

import { useState } from "react";
import { staticVideos } from "./static-videos";
import { VideoItem } from "./video-item";

export const VideoList = () => {
	const [unmuteIndex, setUnmuteIndex] = useState<number | undefined>(undefined);

	const handleToggleMuted = (index: number) => {
		if (unmuteIndex === index) {
			setUnmuteIndex(undefined);
		} else {
			setUnmuteIndex(index);
		}
	};

	return (
		<div className="flex flex-col gap-3 pb-3">
			{staticVideos.map((video, index) => (
				<VideoItem
					key={index}
					src={video.src}
					paperLink={video.paperLink}
					isMuted={unmuteIndex !== index}
					toggleMuted={() => handleToggleMuted(index)}
					playFromBeginningOnUnmute={true}
				/>
			))}
		</div>
	);
};
