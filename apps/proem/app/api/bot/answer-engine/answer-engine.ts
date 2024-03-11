import { answers } from "@/app/api/bot/answer-engine/answers";
import { createAnswerSlugEvent } from "@/app/api/bot/answer-engine/events";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { saveAnswer } from "@/app/api/bot/answer-engine/save-answer";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
	StreamingTextResponse,
	createStreamDataTransformer,
	experimental_StreamData,
} from "ai";

export type ChatHistoryMessage = { role: string; content: string };

type AnswerEngineParams = {
	question: string;
	chatHistory: ChatHistoryMessage[];
	existingSlug?: string;
	userId?: string;
	tags?: string[];
};

const bytesOutputParser = new BytesOutputParser();

export async function askAnswerEngine({
	existingSlug,
	question,
	chatHistory,
	userId,
	tags,
}: AnswerEngineParams) {
	const data = new experimental_StreamData();
	const isFollowUpQuestion = Boolean(existingSlug);
	const slug = existingSlug ?? prettySlug(question);
	const existingAnswers = isFollowUpQuestion
		? await answers.getBySlug(slug)
		: [];

	const existingPapers = existingAnswers[0]?.papers?.papers;

	data.append(createAnswerSlugEvent({ slug }));

	const stream = await answerEngineChain
		.pipe(bytesOutputParser)
		.withConfig({
			runName: isFollowUpQuestion ? "Ask (follow-up)" : "Ask",
			tags,
			metadata: {
				userId,
			},
		})
		.withListeners({
			onEnd: saveAnswer({ question, isFollowUpQuestion, slug, userId, data }),
		})
		.stream({
			question,
			chatHistory: chatHistory.map(toLangChainChatHistory),
			papers: existingPapers,
		});

	return new StreamingTextResponse(
		stream.pipeThrough(createStreamDataTransformer(true)),
		{},
		data,
	);
}
