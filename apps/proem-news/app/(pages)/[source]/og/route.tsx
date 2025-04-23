import { createReadPageOpenGraphImage } from "./news-og-image";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get("source");
	console.log("SEARCH PARAMS", searchParams, url);

	if (!url) {
		throw new Error("No url provided");
	}

	return await createReadPageOpenGraphImage(url, {
		width: 1200,
		height: 630,
	});
}
