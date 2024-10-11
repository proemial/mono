type Video = {
	src: string;
	paperLink: string;
};

/**
 * Note: Remember to add the video to `apps/proem/public/videos`.
 */
export const staticVideos = [
	{
		src: "/videos/magic-mice-125x-compressed.mp4",
		paperLink: "/oa/W4402975017",
	},
	{
		src: "/videos/american-friendship-w4401124912.mp4",
		paperLink: "/oa/W4401124912",
	},
	{
		src: "/videos/chubby-cheek-babies-w4400380733.mp4",
		paperLink: "/oa/W4400380733",
	},
	{
		src: "/videos/covid-lockdowns-w4402349677.mp4",
		paperLink: "/oa/W4402349677",
	},
	{
		src: "/videos/quitting-smoking-w4400000163.mp4",
		paperLink: "/oa/W4400000163",
	},
] satisfies Video[];
