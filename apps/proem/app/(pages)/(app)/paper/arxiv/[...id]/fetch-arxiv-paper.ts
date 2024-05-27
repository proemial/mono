import { fetchFromArxiv } from "@proemial/models/arxiv/transform";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
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
