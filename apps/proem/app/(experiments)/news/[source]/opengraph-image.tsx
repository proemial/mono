import { createReadPageOpenGraphImage } from "./og/create-read-page-open-graph-image";

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
	console.log("SOURCE", source);

	return createReadPageOpenGraphImage(source, size);
}
