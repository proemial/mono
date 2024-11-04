import { NewsAnnotatorScrapeStep } from "@proemial/adapters/redis/news";

export const parseVideo = async (
	url: string,
): Promise<NewsAnnotatorScrapeStep> => {
	const videoId = url.split("v=")[1];
	if (!videoId) {
		throw new Error("No video ID found");
	}
	const rawTranscript = await fetchYoutubeTranscript(videoId);
	if (!rawTranscript.results?.at(0)?.content) {
		throw new Error("No youtube content found");
	}
	const formattedTranscript = rawTranscript.results[0]?.content
		.filter((c) => typeof c.transcriptSegmentRenderer !== "undefined")
		.map((c) => c.transcriptSegmentRenderer?.snippet.runs[0]?.text)
		.join(", ");
	if (!formattedTranscript) {
		throw new Error("No transcript available");
	}
	const title = "TODO: Get title from parsed output";

	return {
		transcript: formattedTranscript,
		artworkUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
		title,
	};
};

type YouTubeTranscriptPayload = {
	results: {
		content: {
			transcriptSegmentRenderer: { snippet: { runs: { text: string }[] } };
		}[];
	}[];
};

const fetchYoutubeTranscript = async (
	videoId: string,
): Promise<YouTubeTranscriptPayload> => {
	const result = await fetch("https://realtime.oxylabs.io/v1/queries", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${Buffer.from(
				`${process.env.OXYLABS_USERNAME}:${process.env.OXYLABS_PASSWORD}`,
			).toString("base64")}`,
		},
		body: JSON.stringify({ source: "youtube_transcript", query: videoId }),
	});

	return await result.json();
};
