import { createSharePageOpenGraphImage } from "@/app/old/(pages)/(app)/share/[shareId]/og/create-share-page-open-graph-image";

export const runtime = "edge";
export const alt = "proem - science answers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
	params: { shareId: string };
};

export default async function SharePageOpenGraphImage({
	params: { shareId },
}: Props) {
	try {
		if (!shareId) {
			throw new Error("No shareId provided in the url");
		}

		return await createSharePageOpenGraphImage(shareId, size);
	} catch (e: any) {
		console.log(`${e.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}
