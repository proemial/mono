import { AsyncCallerParams } from "@langchain/core/utils/async_caller";

type CommonModelOptions = AsyncCallerParams & {
	temperature?: number;
	cache?: boolean;
	verbose?: boolean;
};

const dev = process.env.NODE_ENV === "development";
const verbose = process.env.VERBOSE_LLM === "true";

export const COMMON_MODEL_DEFAULTS: CommonModelOptions = {
	temperature: 0.8,
	cache: dev ? false : true,
	verbose: dev && verbose ? true : false,
	maxConcurrency: dev ? 1 : undefined,
	maxRetries: dev ? 0 : undefined,
	onFailedAttempt: (error) => {
		console.error(error);
	},
};
