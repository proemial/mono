"use server";

import { z } from "zod";

export async function addAnswerAsStarter(
	_prevState: {
		message: string;
	},
	formData: FormData,
) {
	const schema = z.object({
		answerId: z.string().min(1),
	});
	const parse = schema.safeParse({
		answerId: formData.get("answerId"),
	});

	if (!parse.success) {
		return { message: "Failed to create todo" };
	}

	const data = parse.data;

	try {
		// TODO!: add
		// revalidatePath("/");
		return { message: `Added starter: ${data.answerId}` };
	} catch (e) {
		return { message: "Failed to add starter" };
	}
}
