import { Innertube } from "youtubei.js/web";

const youtube = await Innertube.create({
	lang: "en",
	location: "US",
	retrieve_player: false,
});

export const fetchTranscript = async (url: string) => {
	console.log(`Fetching YouTube transcript for video ${url}…`);
	const videoId = url.split("v=")[1];
	if (!videoId) {
		throw new Error("Invalid YouTube video URL");
	}
	try {
		const info = await youtube.getInfo(videoId);
		const { title, channel, view_count, like_count } = info.basic_info;
		const transcriptData = await info.getTranscript();
		const transcript =
			transcriptData.transcript.content?.body?.initial_segments.map(
				(segment) => segment.snippet.text,
			);
		if (!transcript) {
			throw new Error("No transcript found");
		}
		const text = transcript
			.filter((t) => t !== undefined)
			.filter((t) => !t.match(/\[.*?\]/)) // Filter out text in square brackets, like "[Music]"
			.join(" ")
			.replaceAll("\n", " ");
		return {
			title,
			text,
			channel,
			views: view_count,
			likes: like_count,
		};
	} catch (error) {
		console.error("Error fetching transcript:", error);
		throw error;
	}
};
