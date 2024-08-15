import { AnswerEngineStreamData } from "@/app/api/bot/answer-engine/answer-engine";
import { LangChainChatHistoryMessage } from "@/app/llm/utils";
import { answers } from "@proemial/data/repository/answer";
import { prettySlug } from "@proemial/utils/pretty-slug";
import {
	StreamData,
	StreamingTextResponse,
	createStreamDataTransformer,
} from "ai";
import { AgentExecutor } from "langchain/agents";
import {
	handleAnswerEngineEvents,
	stepStartedEvents,
} from "../answer-engine/events";
import { buildAgent } from "./agent";
import { getTools } from "./tools";

type AnswerEngineParams = {
	chatHistory: LangChainChatHistoryMessage[];
	existingSlug?: string;
	userInput: string;
	tags?: string[];
	transactionId: string;
	userId?: string;
	spaceId: string | undefined;
};

export const answerEngine = async ({
	chatHistory,
	existingSlug,
	userInput,
	tags,
	transactionId,
	userId,
	spaceId,
}: AnswerEngineParams) => {
	const data = new StreamData() as AnswerEngineStreamData;
	const isFollowUpQuestion = Boolean(existingSlug);
	const slug = existingSlug ?? prettySlug(userInput);
	const existingAnswers = isFollowUpQuestion
		? await answers.getBySlug(slug)
		: [];
	const existingPapers = existingAnswers[0]?.papers?.papers;

	data.append({
		type: "answer-slug-generated",
		transactionId,
		data: { slug },
	});

	const tools = getTools(data, transactionId);
	const agent = await buildAgent(
		{
			isFollowUpQuestion,
			slug,
			userInput,
			tags,
			transactionId,
			userId,
			spaceId,
		},
		tools,
		data,
	);

	const executor = new AgentExecutor({
		agent,
		tools,
		maxIterations: 3,
		returnIntermediateSteps: true,
	});

	const logStream = executor.streamLog(
		{
			input: userInput,
			chatHistory,
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

	const textEncoder = new TextEncoder();
	const transformStream = new ReadableStream({
		async start(controller) {
			for await (const chunk of logStream) {
				// @ts-ignore
				if (chunk.ops?.length > 0 && chunk?.ops[0].op === "add") {
					const addOp = chunk.ops[0];
					if (
						addOp.path.startsWith("/logs/ChatOpenAI") &&
						typeof addOp.value === "string" &&
						addOp.value.length
					) {
						controller.enqueue(textEncoder.encode(addOp.value));
					}
				}
			}
			controller.close();
		},
	});

	return new StreamingTextResponse(
		transformStream.pipeThrough(createStreamDataTransformer()),
		undefined,
		data,
	);
};
