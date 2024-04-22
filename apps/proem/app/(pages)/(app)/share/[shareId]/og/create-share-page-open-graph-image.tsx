import { AnswerSharingCard } from "@/app/(pages)/(app)/share/[shareId]/og/answer-sharing-card";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { ImageResponse } from "next/og";

export async function createSharePageOpenGraphImage(
	shareId: string,
	size: { width: number; height: number },
) {
	const [sharedAnswer] = await answers.getByShareId(shareId);
	if (!sharedAnswer) {
		throw new Error("no shared answer found for the given shareId");
	}

	const helveticaBold = await fetch(
		new URL(
			"../../../../../../assets/fonts/helvetica/Helvetica-Bold.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	const helvetica = await fetch(
		new URL(
			"../../../../../../assets/fonts/helvetica/Helvetica.ttf",
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
					name: "helvetica",
					data: helvetica,
					weight: 400,
				},
				{
					name: "helvetica",
					data: helveticaBold,
					weight: 700,
				},
			],
		},
	);
}
