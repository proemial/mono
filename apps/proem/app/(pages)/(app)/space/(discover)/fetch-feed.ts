"use server";

import {
	fetchPapersByField,
	fetchPapersByInstitution,
} from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-paper-with-posts-and-readers";
import { summariseTitle } from "@proemial/adapters/llm/prompts/microtitle";
import { Redis } from "@proemial/adapters/redis";
import { RankedPaperId } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";

export const fetchFeedByInstitutionWithPostsAndReaders = async (
	params: { id: string },
	options: FetchFeedParams[1],
	spaceId: string | undefined,
) => {
	const feedByInstitution = await fetchFeedByInstitution(params, options);
	if (!feedByInstitution) {
		return null;
	}

	const paperIds = feedByInstitution.rows.map(({ paper }) => paper.id);
	const papersWithPostsAndReaders = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPostsAndReaders(paperId, spaceId)),
	);
	// TODO!: dirty hack to get TS happy for now. Remove when we have a proper feed
	const rankedPaper = {} as {
		features?: RankedPaperId["features"] | undefined;
		filterMatchScore?: RankedPaperId["filterMatchScore"] | undefined;
	};
	return {
		...feedByInstitution,
		rows: feedByInstitution.rows.map((row) => ({
			...row,
			...rankedPaper,
			type: "organic",
			paper: {
				...row.paper,
				posts:
					papersWithPostsAndReaders.find(
						(paper) => paper.paperId === row.paper.id,
					)?.posts ?? [],
				readers:
					papersWithPostsAndReaders.find(
						(paper) => paper.paperId === row.paper.id,
					)?.readers ?? [],
			},
		})),
	};
};

type FetchFeedParams = Required<Parameters<typeof fetchPapersByField>>;

async function fetchFeedByInstitution(
	params: { id: string },
	options: FetchFeedParams[1],
) {
	const nextOffset = (options?.offset ?? 1) + 1;
	const { meta, papers } = await fetchPapersByInstitution(params, {
		...options,
	});

	if (!papers.length) {
		return null;
	}

	const cachedPapers = await Redis.papers.getAll(
		papers.map((paper) => paper?.id).filter(Boolean),
	);

	const cachedPapersIds = cachedPapers
		.map((cachedPaper) =>
			// we only consider a cachedPaper valid if it has a generated title
			cachedPaper?.generated?.title ? cachedPaper?.id : null,
		)
		.filter(Boolean);

	const cacheMisses = papers.filter(
		(paper) => !cachedPapersIds.includes(paper.id),
	);

	if (cacheMisses.length === 0) {
		return {
			count: meta.count,
			rows: cachedPapers
				.map((paper) => (paper ? { type: "organic", paper: paper } : null))
				.filter((item) => !!item),
			nextOffset,
		};
	}

	const enhancedPapers = await Promise.all(
		papers.map(async (paper) => {
			const paperTitle = paper?.data?.title;
			const abstract = paper?.data?.abstract;
			const generatedTitle = paper?.generated?.title;

			if (!generatedTitle && paperTitle && abstract) {
				const title = (await summariseTitle(
					paperTitle,
					abstract,
					"spaces",
				)) as string;
				const generated = paper.generated
					? { ...paper.generated, title }
					: { title };

				return {
					...paper,
					generated,
				};
			}
		}),
	);
	const withoutNulls = enhancedPapers.filter((p) => !!p);

	console.log("enhancedPapers", enhancedPapers.length, withoutNulls.length);

	await Redis.papers.upsertAll(withoutNulls as OpenAlexPaper[]);

	return {
		count: meta.count,
		rows: withoutNulls.map((paper) => ({ paper: paper as OpenAlexPaper })),
		nextOffset,
	};
}
