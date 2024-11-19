import {
	initLogger,
	traced,
	Span,
	wrapAISDKModel,
	wrapTraced,
	currentSpan,
} from "braintrust";

export enum Project {
	News = "1c2c6025-edae-4bb4-80cb-d2800c042826",
	Ask = "d5983cd3-a8fa-41a2-b76a-3c4267840070",
}

export const llmTrace = {
	init: (project: Project) => {
		return initLogger({
			projectId: project,
			apiKey: process.env.BRAINTRUST_API_KEY,
		});
	},
	projects: Project,
	trace: traced as typeof traced,
	traceId: () => currentSpan().export(),
};

export { wrapTraced, wrapAISDKModel };
export type { Span };
