"use server";

import { answers } from "@/app/api/bot/answer-engine/answers";
import { Answer } from "@proemial/data/neon/schema/answersTable";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addAnswerAsStarterSchema = z.object({
	shareUrl: z
		.string({
			invalid_type_error: "Invalid share URL",
		})
		.regex(/http:\/\/localhost:4242\/share\/([a-zA-Z0-9\\-]+)$/),
});

export async function addAnswerAsStarter(
	prevState: {
		message: string;
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
		return { message: `Added starter: ${shareId}`, resetKey: shareId };
	} catch (e) {
		return { message: "Failed to add starter", resetKey: prevState.resetKey };
	}
}

export async function removeAnswerAsStarter(answerId: Answer["id"]) {
	console.log(answerId);
	try {
		const [updatedStarter] = await answers.removeAsStarter(answerId);
		console.log(updatedStarter);
		if (!updatedStarter) {
			throw new Error();
		}
		revalidatePath("/admin");
	} catch (e) {
		console.log(e);
		// return { message: "Failed to add starter", resetKey: prevState.resetKey };
	}
}
