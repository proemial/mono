import { z } from "zod";

export const PrimaryItemSchema = z.object({
	url: z.string().url({ message: "Must be a valid URL." }),
});
