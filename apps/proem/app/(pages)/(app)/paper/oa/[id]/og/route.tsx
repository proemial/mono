import { createReadPageOpenGraphImage } from "./create-read-page-open-graph-image";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		throw new Error("No id provided in the url");
	}

	// URLSearchParams unescape parameters and we`ll need to escape it again
	const encodedShareId = encodeURIComponent(id);

	return await createReadPageOpenGraphImage(encodedShareId, {
		width: 1200,
		height: 630,
	});
}
