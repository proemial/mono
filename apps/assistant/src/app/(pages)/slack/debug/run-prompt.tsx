"use server";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { answerQuestion } from "@/inngest/workers/ask/1-summarize.task";
import { CoreMessage } from "ai";
import { statusMessages } from "@proemial/adapters/slack/helpers/status-messages";
import { Slack } from "@/inngest/workers/helpers/slack";
import { LlmResponse } from "@/inngest/workers/helpers/extract-references";

import {
	convertSourceRefsToNumberedLinks,
	extractPapers,
} from "@/inngest/workers/helpers/extract-references";

export async function submitConfiguration(data: {
	prompt: string;
	tools: string;
	messages: string;
	metadata: SlackEventMetadata;
}) {
	"use server";

	const { prompt, messages, metadata } = data;

	const status = await Slack.updateStatus(
		metadata,
		statusMessages.ask.begin,
		false,
		true,
	);
	metadata.replyTs = status.ts;

	const llmResponse = await answerQuestion(
		metadata,
		JSON.parse(messages) as CoreMessage[],
		{ prompt, tools: JSON.parse(data.tools) },
	);

	const answer = llmResponse.text as string;
	const papers = extractPapers(llmResponse);
	await Slack.postAnswer(
		metadata,
		convertSourceRefsToNumberedLinks(answer, papers),
	);

	const llmSteps = extractSteps(llmResponse);
	return { answer, llmSteps };
}

function extractSteps(llmResponse: LlmResponse) {
	return llmResponse.response.messages.map((message) => {
		return {
			role: message.role,
			content: message.content.map((content) => {
				console.log("content", content);
				const { result: fullResult, ...rest } = content;
				const result =
					content.toolName === "searchPapers"
						? {
								// @ts-ignore
								papers: fullResult?.papers.map((p) => ({
									id: p.id,
									title: p.title,
									abstract: p.abstract,
									landingPage: p?.primary_location?.landing_page_url,
								})),
							}
						: fullResult;

				return {
					...rest,
					result,
				};
			}),
		};
	});
}
