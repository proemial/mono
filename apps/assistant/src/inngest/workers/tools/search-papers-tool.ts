import { logRetrieval } from "@proemial/adapters/analytics/helicone";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { newId } from "@proemial/utils/uuid";
import { Tool } from "ai";
import { z } from "zod";
import { Slack } from "../helpers/slack";

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

export const getSearchPapersTool = (
	metadata: SlackEventMetadata,
	traceId: string,
) =>
	({
		description: "Find specific research papers matching a user query",
		parameters: z.object({
			question: z.string().describe("The user question"),
			query: z
				.string()
				.describe(
					"You must generate this argument based on the user question, to make it unambiguous and well suited to find relevant supporting information, when vectorized and used as a search query against an article database. Use the original terminology from the user question, but restate the central terms multiple times, and use sysnonyms and adjectives that a researcher would use.",
				),
		}),
		execute: async ({ question, query }) => {
			console.log("PAPER QUERY", question, query);
			await Slack.postDebug(
				metadata,
				`Fetching papers using query: "${query}"`,
			);
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
