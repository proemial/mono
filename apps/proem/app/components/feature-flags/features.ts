export const Features = {
	animateAskStarters: "ASK_STARTERS_ANIMATE_TEXT",
	showAnswerFeedbackButtons: "ASK_ANSWER_FEEDBACK",
	useGuardrailsOnInitialQuestion: "ASK_GUARDRAILS_ON_INITIAL_QUESTION",
	askGpt4: "ASK_GPT4",
	cardShowShortenedTopics: "CARD_SHOW_SHORTENED_TOPICS",
	vectorRerankAndFilter: "VECTOR_RERANK_AND_FILTER",
} as const;

export type FeatureKey = keyof typeof Features;
export type FeatureValue = (typeof Features)[FeatureKey];

type FeaturesValueMap = {
	[K in keyof typeof Features as (typeof Features)[K]]: K;
};

export function keyByValue<T extends keyof FeaturesValueMap>(flag: T) {
	return Object.entries(Features)
		.find((f) => f[1] === flag)
		?.at(0) as FeaturesValueMap[T];
}
