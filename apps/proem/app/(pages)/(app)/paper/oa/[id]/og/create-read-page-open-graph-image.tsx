import { answers } from "@/app/api/bot/answer-engine/answers";
import { ImageResponse } from "next/og";
import { ReadOpenGraphCard } from "./read-og-card";
import { fetchPaper } from "../fetch-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export async function createReadPageOpenGraphImage(
	id: string,
	size: { width: number; height: number },
) {
	const paper = (await fetchPaper(id)) as OpenAlexPaper;
	if (!paper) {
		throw new Error("no paper found for id");
	}

	const latoBold = await fetch(
		new URL(
			"../../../../../../../assets/fonts/lato/Lato-Bold.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	const latoRegular = await fetch(
		new URL(
			"../../../../../../../assets/fonts/lato/Lato-Regular.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<ReadOpenGraphCard paper={paper} classNameAttr="tw" />,
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
