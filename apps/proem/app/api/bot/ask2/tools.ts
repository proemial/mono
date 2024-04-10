import { searchToolConfig } from "@/app/prompts/ask_agent";
import { DynamicTool } from "langchain/tools";
import { Paper } from "../../paper-search/search";
import { AnswerEngineStreamData } from "../answer-engine/answer-engine";
import { openAlexChain } from "./fetch-papers";

export const getTools = (
	data: AnswerEngineStreamData,
	transactionId: string,
) => {
	const openAlexTool = buildOpenAlexTool(data, transactionId);
	return [openAlexTool];
};

const buildOpenAlexTool = (
	data: AnswerEngineStreamData,
	transactionId: string,
) =>
	new DynamicTool({
		...searchToolConfig,
		callbacks: [
			{
				handleToolEnd: async (output) => {
					const papers = JSON.parse(output) as Paper[];
					data.append({
						type: "top-5-papers-identified",
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
		func: openAlexQuery,
	});

const openAlexQuery = async (input: string) => {
	console.log("Triggered SearchPapers,", `input: '${input}'`);

	const result = await openAlexChain.invoke({
		question: input,
	});

	return result.papers;
};
