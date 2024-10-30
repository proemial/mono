import { createReadPageOpenGraphImage } from "./og/news-og-image";

export const runtime = "edge";
export const alt = "proem - science answers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
	params: { source: string };
};

export default async function ReadPageOpenGraphImage({
	params: { source },
}: Props) {
	console.log("SOURCE", decodeURIComponent(source));

	return createReadPageOpenGraphImage(decodeURIComponent(source), size);
}
