import { answers } from "@/app/api/bot/answer-engine/answers";
import {
	type AnswerEngineEvents,
	handleAnswerEngineEvents,
	stepStartedEvents,
} from "@/app/api/bot/answer-engine/events";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { saveAnswer } from "@/app/api/bot/answer-engine/save-answer";
import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { followUpQuestionChainNew } from "@/app/llm/chains/follow-up-questions-chain_v2";
import { findRun } from "@/app/llm/helpers/find-run";
import { toLangChainChatHistory } from "@/app/llm/utils";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
	StreamingTextResponse,
	createStreamDataTransformer,
	experimental_StreamData,
} from "ai";
import { z } from "zod";

export const AIMessage = z.object({
	id: z.string(),
	content: z.string(),
	role: z.enum(["system", "user", "assistant", "function", "data", "tool"]),
});

export type ChatHistoryMessage = z.infer<typeof AIMessage>;

type AnswerEngineParams = {
	chatHistory: ChatHistoryMessage[];
	existingSlug?: string;
	question: string;
	tags?: string[];
	transactionId: string;
	userId?: string;
};

const bytesOutputParser = new BytesOutputParser();

export interface AnswerEngineStreamData extends experimental_StreamData {
	append(event: AnswerEngineEvents): void;
}

export async function askAnswerEngine({
	chatHistory,
	existingSlug,
	question,
	tags,
	transactionId,
	userId,
}: AnswerEngineParams) {
	const data = new experimental_StreamData() as AnswerEngineStreamData;
	const isFollowUpQuestion = Boolean(existingSlug);
	const slug = existingSlug ?? prettySlug(question);
	const existingAnswers = isFollowUpQuestion
		? await answers.getBySlug(slug)
		: [];

	const existingPapers = existingAnswers[0]?.papers?.papers;

	data.append({
		type: "answer-slug-generated",
		transactionId,
		data: { slug },
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
			onEnd: async (run) => {
				const answer = findRun(run, (run) => run.name === "AnswerEngine")
					?.outputs?.output;

				const saveAnswerPromise = saveAnswer({
					question,
					isFollowUpQuestion,
					slug,
					userId,
					run,
				}).then((insertedAnswer) => {
					if (insertedAnswer) {
						data.append({
							type: "answer-saved",
							transactionId,
							data: {
								shareId: insertedAnswer.shareId,
								runId: run.id,
							},
						});
					}
				});
				const newFollowups = (await getFeatureFlag("newFollowups")) ?? false;
				const followUpChain = newFollowups
					? followUpQuestionChainNew
					: followUpQuestionChain;

				const followUpsQuestionPromise = followUpChain
					.invoke({
						question,
						answer,
					})
					.then((followUpsQuestions) => {
						// TODO! Save follow-up questions to the database
						data.append({
							type: "follow-up-questions-generated",
							transactionId,
							data: followUpsQuestions
								.split("?")
								.filter(Boolean)
								.map((question) => ({ question: `${question.trim()}?` })),
						});
					});

				// Waiting for all sideeffects relying on data to finish before closing the data stream
				Promise.all([saveAnswerPromise, followUpsQuestionPromise]).then(() => {
					data.close();
				});
			},
		})
		.stream(
			{
				question,
				chatHistory: chatHistory.map(toLangChainChatHistory),
				papers: existingPapers,
			},
			{
				callbacks: [
					{
						handleChainStart(
							_chain,
							_inputs,
							_runId,
							_parentRunId,
							_tags,
							_metadata,
							_runType,
							name,
						) {
							if (name && stepStartedEvents.includes(name)) {
								data.append({
									type: "step-started",
									transactionId,
									data: { name },
								});
							}
						},
						handleChainEnd(token, _runId, _parentRunId, tags) {
							handleAnswerEngineEvents({ tags, data: token }, (event) => {
								data.append(event);
							});
						},
					},
				],
			},
		);

	return new StreamingTextResponse(
		stream.pipeThrough(createStreamDataTransformer(true)),
		{},
		data,
	);
}
