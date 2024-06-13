import { fetchFromArxiv } from "@proemial/repositories/arxiv/fetch/papers";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Redis } from "@proemial/redis/redis";
import { cache } from "react";

export const fetchArxivPaper = cache(
	async (idStr: string): Promise<OpenAlexPaper | null> => {
		const id = idStr.split("/").at(0) as string;
		console.log("[fetchArxivPaper] Fetch", id);

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
