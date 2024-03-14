import { answers } from "@/app/api/bot/answer-engine/answers";
import {
	AnswerEngineEvents,
	handleAnswerEngineEvents,
} from "@/app/api/bot/answer-engine/events";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { saveAnswer } from "@/app/api/bot/answer-engine/save-answer";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { findRun } from "@/app/llm/helpers/find-run";
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

// Chain names it's safe to publish to the client
const chainNamesClientShouldListenFor = ["FetchPapers", "GenerateAnswer"];

const bytesOutputParser = new BytesOutputParser();

export interface AnswerEngineStreamData extends experimental_StreamData {
	append(event: AnswerEngineEvents): void;
}

export async function askAnswerEngine({
	existingSlug,
	question,
	chatHistory,
	userId,
	tags,
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
							data: {
								shareId: insertedAnswer.shareId,
								answer: insertedAnswer.answer,
								runId: run.id,
							},
						});
					}
				});

				const followUpsQuestionPromise = followUpQuestionChain
					.invoke({
						question,
						answer,
					})
					.then((followUpsQuestions) => {
						data.append({
							type: "follow-up-questions-generated",
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
							if (name && chainNamesClientShouldListenFor.includes(name)) {
								data.append({ type: "step-started", data: { name } });
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
