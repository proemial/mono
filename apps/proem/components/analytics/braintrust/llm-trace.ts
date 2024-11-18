import { initLogger, traced, Span, wrapAISDKModel } from "braintrust";

export const llmTrace = {
	init: initBraintrust,
	trace: traced as typeof traced,
	wrap: wrapAISDKModel as typeof wrapAISDKModel,
};

function initBraintrust(projectName: string) {
	initLogger({
		projectName,
		apiKey: process.env.BRAINTRUST_API_KEY,
	});
}

export type { Span };
