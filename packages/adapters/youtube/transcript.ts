import { Innertube } from "youtubei.js/web";
import { getVideoId, YouTubeTranscript } from "./shared";

const youtube = await Innertube.create({
	lang: "en",
	location: "US",
	retrieve_player: false,
});

/**
 * Uses a library to fetch the transcript from YouTube's API.
 * Warning: This is blocked by YouTube when run from various hosting providers
 */
export const fetchTranscript = async (
	url: string,
): Promise<YouTubeTranscript> => {
	const videoId = getVideoId(url);
	console.log(`Fetching YouTube transcript for video id ${videoId}…`);
	if (!videoId) {
		throw new Error("Invalid YouTube video URL");
	}
	try {
		const info = await youtube.getInfo(videoId);
		const { title, thumbnail } = info.basic_info;
		if (!title) {
			throw new Error("No title found");
		}
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
			images: thumbnail ?? [],
		};
	} catch (error) {
		console.error("Error fetching transcript:", error);
		throw error;
	}
};
