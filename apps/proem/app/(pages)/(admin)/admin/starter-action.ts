"use server";

import { answers } from "@/app/api/bot/answer-engine/answers";
import { Answer } from "@proemial/data/neon/schema/answersTable";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addAnswerAsStarterSchema = z.object({
	shareUrl: z
		.string({
			description: "Invalid share URL",
			invalid_type_error: "Invalid share URL",
			required_error: "Invalid share URL required",
		})
		.regex(
			/^.+\/share\/.+/,
			"Does not match the valid share url format: https://proem.ai/share/1234 ",
		),
});

export async function addAnswerAsStarter(
	prevState: {
		error: string | null;
		resetKey: string;
	},
	formData: FormData,
) {
	try {
		const { shareUrl } = addAnswerAsStarterSchema.parse({
			shareUrl: formData.get("shareUrl"),
		});

		const shareId = shareUrl.split("/").at(-1);

		if (!shareId) {
			throw new Error();
		}

		const [updatedStarter] = await answers.addAsStarter(shareId);

		if (!updatedStarter) {
			throw new Error();
		}
		revalidatePath("/admin");
		return { error: null, resetKey: shareId };
	} catch (e) {
		console.log(e);
		const errorMessage =
			e instanceof z.ZodError
				? e.flatten().fieldErrors.shareUrl?.toString() ??
					"Failed to validate the URL"
				: "Failed to add starter";

		return { error: errorMessage, resetKey: prevState.resetKey };
	}
}

export async function removeAnswerAsStarter(answerId: Answer["id"]) {
	try {
		const [updatedStarter] = await answers.removeAsStarter(answerId);

		if (!updatedStarter) {
			throw new Error();
		}
		revalidatePath("/admin");
	} catch (e) {
		console.log(e);
	}
}
