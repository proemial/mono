export type YouTubeTranscript = {
	title: string;
	text: string;
	images: Array<{
		url: string;
		width?: number;
		height?: number;
	}>;
};

export const isYouTubeUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		(urlObj.hostname.includes("youtube.com") ||
			urlObj.hostname.includes("youtu.be")) &&
		!(
			urlObj.hostname.endsWith("youtube.com") ||
			urlObj.hostname.endsWith("youtu.be") ||
			urlObj.hostname.endsWith("youtube.com/") ||
			urlObj.hostname.endsWith("youtu.be/")
		)
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
	return normalizedUrl;
};

export const getVideoId = (url: string): string => {
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
		throw new Error(`Invalid YouTube URL: ${url}`);
	}
};
