import { ImageResponse } from "next/og";
import { ReadOpenGraphCard } from "./news-og-card";
import { Redis } from "@proemial/adapters/redis";

export async function createReadPageOpenGraphImage(
	url: string,
	size: { width: number; height: number },
) {
	const paper = await Redis.news.get(url);
	if (!paper) {
		throw new Error(`no item found for url: ${url}`);
	}

	const latoBold = await fetch(
		new URL("../../../../assets/fonts/lato/Lato-Bold.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const latoRegular = await fetch(
		new URL("../../../../assets/fonts/lato/Lato-Regular.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<ReadOpenGraphCard item={paper} classNameAttr="tw" />,
		{
			...size,
			fonts: [
				{
					name: "lato",
					data: latoRegular,
					weight: 400,
				},
				{
					name: "lato",
					data: latoBold,
					weight: 700,
				},
			],
		},
	);
}
