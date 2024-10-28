import { z } from "zod";

export const PrimaryItemSchema = z.object({
	type: z.enum(["article", "youtube"]),
	url: z.string().url({ message: "Must be a valid URL." }),
});
