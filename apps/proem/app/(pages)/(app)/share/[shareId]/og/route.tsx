import { createSharePageOpenGraphImage } from "@/app/(pages)/(app)/share/[shareId]/og/create-share-page-open-graph-image";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const shareId = searchParams.get("shareId");
	if (!shareId) {
		throw new Error("No shareId provided in the url");
	}

	return await createSharePageOpenGraphImage(shareId, {
		width: 1200,
		height: 630,
	});
}
