import { AsyncCallerParams } from "@langchain/core/utils/async_caller";

type CommonModelOptions = AsyncCallerParams & {
	temperature?: number;
	cache?: boolean;
	verbose?: boolean;
};

export const COMMON_MODEL_DEFAULTS: CommonModelOptions = {
	temperature: 0.8,
	cache: process.env.NODE_ENV === "development" ? false : true,
	verbose: process.env.NODE_ENV === "development" ? true : false,
	maxConcurrency: process.env.NODE_ENV === "development" ? 1 : undefined,
	maxRetries: process.env.NODE_ENV === "development" ? 0 : undefined,
	onFailedAttempt: (error) => {
		console.error(error);
	},
};
