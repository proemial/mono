import {
	initLogger,
	traced,
	Span,
	wrapAISDKModel,
	wrapTraced,
	currentSpan,
} from "braintrust";

export const llmTrace = {
	init: (projectName: string) => {
		return initLogger({
			projectName,
			apiKey: process.env.BRAINTRUST_API_KEY,
		});
	},
	trace: traced as typeof traced,
	traceId: () => currentSpan().export(),
};

export { wrapTraced, wrapAISDKModel };
export type { Span };
