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

	if (filter.features && filter.days) {
		return [
			"feed",
			`filter_${filter.days}:${filter.features.map((f) => f.id).join("|")}`,
		];
	}

	return ["feed", "anonymous"];
};
