import { getVideoId, YouTubeTranscript } from "./shared";

type YouTubeTranscriptPayload = {
	results: {
		content: {
			transcriptSegmentRenderer: { snippet: { runs: { text: string }[] } };
		}[];
	}[];
	message?: string;
};

export const fetchTranscript = async (
	url: string,
): Promise<YouTubeTranscript> => {
	const videoId = getVideoId(url);
	console.log(`Fetching YouTube transcript for video id ${videoId}…`);
	if (!videoId) {
		throw new Error("Invalid YouTube video URL");
	}
	try {
		if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
			throw new Error("Missing OxyLabs credentials");
		}
		const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${Buffer.from(
					`${process.env.OXYLABS_USERNAME}:${process.env.OXYLABS_PASSWORD}`,
				).toString("base64")}`,
			},
			body: JSON.stringify({
				source: "youtube_transcript",
				query: videoId,
				context: [{ key: "language_code", value: "en" }],
			}),
		});
		const responsePayload = (await response.json()) as YouTubeTranscriptPayload;
		if (responsePayload.message) {
			throw new Error(`OxyLabs error: ${responsePayload.message}`);
		}
		if (!responsePayload.results?.at(0)?.content) {
			throw new Error("YouTube content unavailable");
		}

		const formattedTranscript = responsePayload.results[0]?.content
			.filter((c) => typeof c.transcriptSegmentRenderer !== "undefined")
			.map((c) => c.transcriptSegmentRenderer?.snippet.runs[0]?.text)
			.join(" ")
			.replaceAll("\n", " ");
		if (!formattedTranscript) {
			throw new Error("Transcript unavailable");
		}
		console.log(
			`Successfully fetched YouTube transcript for video id ${videoId}…`,
		);
		return {
			title: "", // TODO: OxyLabs doesn't provide a video title
			text: formattedTranscript,
			images: [], // TODO: OxyLabs doesn't provide video thumbnails
		};
	} catch (error) {
		console.error("Error fetching transcript:", error);
		throw error;
	}
};
