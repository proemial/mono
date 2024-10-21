import { z } from "zod";

export const FormSchema = z.object({
	newsArticle: z
		.string()
		.min(1, {
			message: "News article must be at least 1 character.",
		})
		.max(9999, {
			message: "News article must not be longer than 9999 characters.",
		}),
});
