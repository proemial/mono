import { Innertube } from "youtubei.js/web";

type YouTubeTranscript = {
	title: string;
	text: string;
	images: Array<{
		url: string;
		width: number;
		height: number;
	}>;
};

const youtube = await Innertube.create({
	lang: "en",
	location: "US",
	retrieve_player: false,
});

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
		console.log(`YOUTUBE VIDEO INFO: ${JSON.stringify(info)}`);
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
		console.log(
			`Successfully fetched YouTube transcript for video id ${videoId}…`,
		);
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

export const isYouTubeUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("youtube.com") ||
		urlObj.hostname.includes("youtu.be")
	);
};

/**
 * Use this to normalize YouTube URL values in the database.
 *
 * Example:
 * https://www.youtube.com/watch?v=w5dK6gJwKKw&t=13s -> https://youtube.com/v/w5dK6gJwKKw
 * https://www.youtube.com/watch?v=Rmi-ckbMOQE&list=PLlET0GsrLUL59YbxstZE71WszP3pVnZfI&index=8 -> https://youtube.com/v/Rmi-ckbMOQE
 */
export const normalizeYouTubeUrl = (url: string) => {
	if (!isYouTubeUrl(url)) {
		return url;
	}
	const videoId = getVideoId(url);
	const normalizedUrl = `https://youtube.com/v/${videoId}`;
	console.log(`Normalized YouTube URL: ${normalizedUrl}`);
	return normalizedUrl;
};

const getVideoId = (url: string): string => {
	try {
		const urlObj = new URL(url);
		// Handle youtube.com/watch?v=ID
		if (urlObj.searchParams.has("v")) {
			return urlObj.searchParams.get("v") as string;
		}
		// Handle youtu.be/ID
		if (urlObj.hostname === "youtu.be") {
			return urlObj.pathname.slice(1);
		}
		// Handle youtube.com/v/ID
		if (urlObj.pathname.startsWith("/v/")) {
			return urlObj.pathname.slice(3);
		}
		throw new Error("Could not extract video ID from URL");
	} catch (error) {
		throw new Error("Invalid YouTube URL");
	}
};
