export const Features = {
  showMainTopicInCards: "CARD_FOOTER_SHOW_MAIN_TOPIC",
  showSubfieldInCards: "CARD_FOOTER_SHOW_SUBFIELD",
  hideConceptsInCards: "CARD_FOOTER_HIDE_CONCEPTS",
  showJournalInCards: "CARD_FOOTER_SHOW_JOURNAL",
  showOrgInCards: "CARD_FOOTER_SHOW_ORG",
  fetchPreprintsOnly: "FEED_FETCH_APPROXIMATED_PREPRINTS_ONLY",
} as const;

export type FeatureKey = keyof typeof Features;
export type FeatureValue = (typeof Features)[FeatureKey];
