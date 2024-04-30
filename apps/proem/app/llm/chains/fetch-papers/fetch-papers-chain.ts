import { fetchPapers, type Paper } from "@/app/api/paper-search/search";
import {
	RunnableLambda,
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { searchParamsChain } from "./search-params-chain";
import { OpenAlexQueryParams } from "./oa-search-helpers";
import { Metrics } from "@/components/analytics/sentry/metrics";

type Input = {
	question: string;
	papers: Paper[] | undefined;
};

export type PapersAsString = string;

function withoutDuplicates(withoutDups: Paper[], withDups: Paper[]) {
	return withDups.filter(
		(potentialDup) =>
			!withoutDups.map((paper) => paper.link).includes(potentialDup.link),
	);
}

const queryOpenAlex = RunnableLambda.from<OpenAlexQueryParams, Paper[]>(
	async (input) => {
		const promises = Object.keys(input.searchQueries).map((key) =>
			fetchPapers(input.searchQueries[key] as string, { metadata: key }),
		);

		const begin = Metrics.now();
		const results = await Promise.all(promises);
		Metrics.elapsedSince(begin, "ask.papers.fetchall");

		Object.keys(input.searchQueries).forEach((key, i) => {
			Metrics.paperQueryExecuted(key, results[i]?.length ?? 0);
		});

		const counts = [];
		const papers = [] as Paper[];
		for (const newPapers of results) {
			const deduplicated = withoutDuplicates(papers, newPapers).map(
				(paper) => ({
					...paper,
					metadata: `${paper.metadata} [${newPapers.length}]`,
				}),
			);
			papers.push(...deduplicated);
			counts.push(deduplicated.length);
		}
		console.log(`${counts.join("+")}=${papers.length} papers fetched`);

		return papers?.map(toRelativeLink) ?? [];
	},
).withConfig({ runName: "QueryOpenAlex" });

export const fetchPapersChain = RunnableSequence.from<Input, PapersAsString>([
	RunnablePassthrough.assign({
		papers: searchParamsChain
			.pipe(queryOpenAlex)
			.withConfig({ runName: "FetchPapers" }),
	}),
	(input) => JSON.stringify(input.papers),
]);

const toRelativeLink = (paper: Paper) => {
	return {
		metadata: paper.metadata,
		title: paper.title,
		link: paper.link.replace("https://proem.ai", ""),
		abstract: paper.abstract ?? "",
		publicationDate: paper.publicationDate,
	};
};
