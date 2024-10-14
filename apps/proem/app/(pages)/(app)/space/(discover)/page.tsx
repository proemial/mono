import dynamic from "next/dynamic";

const VideoCarousel = dynamic(
	() =>
		import("@/components/video/video-carousel").then(
			(mod) => mod.VideoCarousel,
		),
	{ ssr: false },
);
const VideoList = dynamic(
	() => import("@/components/video/video-list").then((mod) => mod.VideoList),
	{ ssr: false },
);

export default function DiscoverPage() {
	return (
		<>
			<div className="sm:hidden block">
				<VideoCarousel />
			</div>
			<div className="hidden sm:block">
				<VideoList />
			</div>
		</>
	);
}
