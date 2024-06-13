// Unused import fixes `Open
// The inferred type of "X" cannot be named without a reference to "Y". This is likely not portable. A type annotation is necessary.`
import { OpenAlexPaper } from "@proemial/papers/oa/models/oa-paper";
import { OpenAlexPapers } from "./adapters/papers";

import { z } from "zod";

export const envVariables = z.object({
	REDIS_PAPERS_TOKEN: z.string(),
	REDIS_PAPERS_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}

export const Redis = {
	papers: OpenAlexPapers,
};
