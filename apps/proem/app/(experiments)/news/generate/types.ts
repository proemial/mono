import { z } from "zod";

export const FormSchema = z.object({
	content: z
		.string()
		.min(100, {
			message: "Must be at least 100 characters.",
		})
		.max(20000, {
			message: "Must not be longer than 20.000 characters.",
		}),
});
