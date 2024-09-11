import { FeedProps } from "../app/(pages)/(app)/space/(discover)/feed";

export const getFeedQueryKey = (
	filter: FeedProps["filter"],
): ["feed", ...string[]] => {
	if ("institution" in filter) {
		return ["feed", filter.institution];
	}

	if ("collectionId" in filter && filter.collectionId) {
		return ["feed", filter.collectionId];
	}

	if ("features" in filter && filter.features) {
		return [
			"feed",
			`filter_${filter.days}:${filter.features.map((f) => f.id).join("|")}`,
		];
	}

	if ("collectionId" in filter && filter.collectionId) {
		return ["feed", filter.collectionId];
	}

	return ["feed", "anonymous"];
};
