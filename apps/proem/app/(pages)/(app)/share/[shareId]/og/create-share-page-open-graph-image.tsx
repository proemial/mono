import { AnswerSharingCard } from "@/app/(pages)/(app)/share/[shareId]/og/answer-sharing-card";
import { answers } from "@proemial/data/repository/answer";
import { ImageResponse } from "next/og";

export async function createSharePageOpenGraphImage(
	shareId: string,
	size: { width: number; height: number },
) {
	const [sharedAnswer] = await answers.getByShareId(shareId);
	if (!sharedAnswer) {
		throw new Error("no shared answer found for the given shareId");
	}

	const latoBold = await fetch(
		new URL(
			"../../../../../../assets/fonts/lato/Lato-Bold.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	const latoRegular = await fetch(
		new URL(
			"../../../../../../assets/fonts/lato/Lato-Regular.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<AnswerSharingCard
			content={sharedAnswer.answer ?? ""}
			classNameAttr="tw"
		/>,
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
