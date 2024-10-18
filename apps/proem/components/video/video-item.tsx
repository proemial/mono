"use client";

import { routes } from "@/routes";
import { File06, VolumeMax, VolumeX } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { Throbber } from "../throbber";

export type VideoItemProps = {
	src: string;
	paperLink: string;
	isMuted: boolean;
	toggleMuted: () => void;
	playing?: boolean;
	playFromBeginningOnUnmute?: boolean;
};

export const VideoItem = ({
	src,
	paperLink,
	isMuted,
	toggleMuted,
	playing = true,
	playFromBeginningOnUnmute = false,
}: VideoItemProps) => {
	const paperId = paperLink.split("/").pop() ?? "";
	const router = useRouter();
	const ref = useRef<ReactPlayer>(null);
	const [isReady, setIsReady] = useState(false);

	const handleMuteClick = (event: MouseEvent<HTMLDivElement>) => {
		if (isMuted) {
			trackHandler(analyticsKeys.feed.videoCard.unmute, { paperId })();
			if (playFromBeginningOnUnmute) {
				ref.current?.seekTo(0);
			}
		} else {
			trackHandler(analyticsKeys.feed.videoCard.mute, { paperId })();
		}
		toggleMuted();
	};

	const handleVideoClick = (event: MouseEvent<HTMLDivElement>) => {
		trackHandler(analyticsKeys.feed.videoCard.click, { paperId })();
		router.push(`${routes.paper}/${paperLink}`);
	};

	const handleReady = (player: ReactPlayer) => {
		if (!isReady) {
			setIsReady(true);
		}
	};

	return (
		<div className="relative shadow h-full w-full rounded-2xl overflow-hidden">
			<ReactPlayer
				ref={ref}
				url={src}
				playing={playing}
				width="100%"
				height="100%"
				pip={false}
				controls={false}
				playsinline={true}
				loop={true}
				muted={isMuted}
				volume={1}
				fallback={
					<div className="min-h-[calc(100dvh-72px)]">
						<Throbber />
					</div>
				}
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
				onReady={handleReady}
			/>
			{isReady && (
				<div className="absolute flex justify-between gap-2 top-0 left-0 w-full">
					<div
						className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full m-1 p-4 cursor-pointer"
						onClick={handleVideoClick}
					>
						<File06 className="size-5" />
						<span className="text-sm">View paper</span>
					</div>
					<div
						className="text-white hover:bg-white/10 rounded-full m-1 p-4 cursor-pointer"
						onClick={handleMuteClick}
					>
						{isMuted ? (
							<VolumeX className="size-5" />
						) : (
							<VolumeMax className="size-5" />
						)}
					</div>
				</div>
			)}
		</div>
	);
};
