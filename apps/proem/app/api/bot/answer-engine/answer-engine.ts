import { answers } from "@/app/api/bot/answer-engine/answers";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import { findRun } from "@/app/llm/helpers/find-run";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { Run } from "@langchain/core/tracers/base";
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

	data.append({
		slug,
	});

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
			onEnd: saveAnswer(question, isFollowUpQuestion, slug, userId, data),
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

const saveAnswer =
	(
		question: string,
		isFollowUpQuestion: boolean,
		slug: string,
		userId: string | undefined,
		data: experimental_StreamData,
	) =>
	async (run: Run) => {
		const hasAnswer = (run: Run) => run.name === "AnswerEngine";
		const answer = findRun(run, hasAnswer)?.outputs?.output;

		if (!answer) {
			data.close();
			throw new Error("Save failure: No answer was found");
		}

		const hasPapersResponse = (run: Run) => run.name === "FetchPapersTool";
		const papersResponse = findRun(run, hasPapersResponse)?.outputs
			?.output as string;

		const hasSearchParamsResponse = (run: Run) =>
			run.name === "GenerateSearchParams";
		const searchParamsResponse = findRun(run, hasSearchParamsResponse)
			?.outputs as { keyConcept: string; relatedConcepts: string[] };

		const papers = isFollowUpQuestion
			? {}
			: {
					relatedConcepts: searchParamsResponse.relatedConcepts,
					keyConcept: searchParamsResponse.keyConcept,
					papers: {
						papers: JSON.parse(papersResponse),
					},
			  };

		const insertedAnswer = await answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});

		if (!insertedAnswer) {
			data.close();
			return;
		}

		data.append({
			answers: {
				shareId: insertedAnswer.shareId,
				answer: insertedAnswer.answer,
			},
		});
		data.close();
	};
