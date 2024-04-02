"use server";

import { z } from "zod";

const addAnswerAsStarterSchema = z.object({
	shareUrl: z
		.string()
		.regex(/http:\/\/localhost:4242\/share\/([a-zA-Z0-9\\-]+)$/),
});

export async function addAnswerAsStarter(
	_prevState: {
		message: string;
	},
	formData: FormData,
) {
	try {
		const { shareUrl } = addAnswerAsStarterSchema.parse({
			shareUrl: formData.get("shareId"),
		});

		const shareId = shareUrl.split("/").at(-1);

		if (!shareId) {
			throw new Error();
		}

		console.log(shareId);

		// TODO!: add
		// revalidatePath("/");
		return { message: `Added starter: ${shareId}` };
	} catch (e) {
		return { message: "Failed to add starter" };
	}
}
