import { fetchFromArxiv } from "@proemial/models/arxiv/transform";
import {
	OpenAlexPaper,
	OpenAlexWorkMetadata,
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
} from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { fromInvertedIndex } from "@proemial/utils/string";
import { cache } from "react";

export const fetchArxivPaper = cache(
	async (id: string): Promise<OpenAlexPaper | null> => {
		const paper = await Redis.papers.get(id, "arxiv");

		if (!paper) {
			console.log("[fetchArxivPaper] Fetch", id);
			const data = await fetchFromArxiv(id);

			if (data) {
				console.log("[fetchArxivPaper] Upsert", id);
				return await Redis.papers.upsert(
					id,
					(existingPaper) => {
						return {
							...existingPaper,
							data,
							id,
						};
					},
					"arxiv",
				);
			}
		}
		return paper;
	},
);
