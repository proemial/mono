import {
	initLogger,
	traced,
	Span,
	wrapAISDKModel,
	currentSpan,
} from "braintrust";

export const llmTrace = {
	init: initBraintrust,
	trace: traced as typeof traced,
	wrap: wrapAISDKModel as typeof wrapAISDKModel,
	traceId: () => currentSpan().export(),
};

function initBraintrust(projectName: string) {
	return initLogger({
		projectName,
		apiKey: process.env.BRAINTRUST_API_KEY,
	});
}

export type { Span };
