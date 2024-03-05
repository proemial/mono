export const Features = {
	showMainTopicInCards: "CARD_FOOTER_SHOW_MAIN_TOPIC",
	showSubfieldInCards: "CARD_FOOTER_SHOW_SUBFIELD",
	hideConceptsInCards: "CARD_FOOTER_HIDE_CONCEPTS",
	showJournalInCards: "CARD_FOOTER_SHOW_JOURNAL",
	showOrgInCards: "CARD_FOOTER_SHOW_ORG",
	fetchPreprintsOnly: "FEED_FETCH_APPROXIMATED_PREPRINTS_ONLY",
	fetchWithoutPreprintsFilter: "FEED_FETCH_WITHOUT_PREPRINTS_FILTER",
	animateAskStarters: "ASK_STARTERS_ANIMATE_TEXT",
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
