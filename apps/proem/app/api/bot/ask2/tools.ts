import { searchToolConfig } from "@/app/prompts/ask_agent";
import { DynamicTool } from "@langchain/core/tools";
import { Paper } from "../../paper-search/search";
import { AnswerEngineStreamData } from "../answer-engine/answer-engine";
import { QdrantPaper } from "../../news/annotate/fetch/steps/fetch";
import { openAlexChain } from "./fetch-papers";
import { Time } from "@proemial/utils/time";

export const getTools = (
	data: AnswerEngineStreamData,
	transactionId: string,
	vectorIndex?: boolean,
) => {
	return [
		buildSearchTool(
			data,
			transactionId,
			vectorIndex ? qdrantQuery : openAlexQuery,
		),
	];
};

const buildSearchTool = (
	data: AnswerEngineStreamData,
	transactionId: string,
	func: (input: string) => Promise<string>,
) =>
	new DynamicTool({
		...searchToolConfig,
		callbacks: [
			{
				handleToolEnd: async (output) => {
					const papers = JSON.parse(output) as Paper[];
					data.append({
						type: "papers-fetched",
						transactionId,
						data: {
							papers: papers.map((paper) => ({
								link: paper.link,
								title: paper.title,
								published: paper.publicationDate,
							})),
						},
					});
				},
			},
		],
		func,
	});

const openAlexQuery = async (input: string): Promise<string> => {
	const begin = Time.now();

	try {
		const result = await openAlexChain.invoke({
			question: input,
		});
		return result.papers;
	} finally {
		Time.log(begin, `[openAlexQuery] ${input}`);
	}
};

const qdrantQuery = async (input: string): Promise<string> => {
	const begin = Time.now();

	try {
		const papersResult = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: input,
				from: "2024-01-01",
				extended: true,
			}),
		});
		const { papers } = (await papersResult.json()) as { papers: QdrantPaper[] };
		console.log("Papers", papers.length);

		const mapped = papers.map(
			(paper) =>
				({
					link: `oa/${paper.id.split("/").at(-1)}`,
					title: paper.title,
					abstract: paper.abstract,
					publicationDate: paper.published,
				}) as Paper,
		);
		return JSON.stringify(mapped);
	} finally {
		Time.log(begin, `[qdrantQuery] ${input}`);
	}
};
