import { logRetrieval } from "@proemial/adapters/analytics/helicone";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { newId } from "@proemial/utils/uuid";
import { Tool } from "ai";
import { z } from "zod";
import { Slack } from "../helpers/slack";
import { answerParams } from "@/prompts/ask/summarize-prompt";

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

export type PaperWithSrcRef = QdrantPaper & { srcRefId: string };

const tool = answerParams.tools.searchPapers;

export const getSearchPapersTool = (
	metadata: SlackEventMetadata,
	traceId: string,
	params?: typeof answerParams.tools.searchPapers,
) =>
	({
		description: params?.description ?? tool.description,
		parameters: z.object({
			query: z
				.string()
				.describe(params?.parameters.query ?? tool.parameters.query),
		}),
		execute: async ({ query }) => {
			console.log("Tool invocation: Search Papers", query);
			await Slack.updateStatus(metadata, statusMessages.ask.fetch);

			const papers = (await logRetrieval(
				"assistant",
				query,
				async <RetrievalResult>() => {
					return (await fetchPapers(query)) as RetrievalResult;
				},
				traceId,
			)) as QdrantPaper[];

			await Slack.updateStatus(metadata, statusMessages.ask.summarize);
			console.log("Papers retrieved", papers.length);

			return {
				papers: papers.map(
					(p) =>
						({
							...p,
							srcRefId: newId("source_reference"),
						}) satisfies PaperWithSrcRef,
				),
			};
		},
	}) satisfies Tool;

export async function fetchPapers(query: string) {
	try {
		const result = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: query as string,
				from: "2024-01-01",
				extended: true,
			}),
		});
		const { papers } = (await result.json()) as { papers: QdrantPaper[] };

		return papers;
	} catch (e) {
		console.error("[news][fetch] failed to fetch papers", e);
		throw new Error("[news][fetch] failed to fetch papers", {
			cause: {
				error: e,
			},
		});
	}
}
