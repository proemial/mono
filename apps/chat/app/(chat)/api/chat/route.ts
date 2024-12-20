import {
	Message,
	StreamData,
	convertToCoreMessages,
	generateObject,
	generateText,
	streamText,
} from "ai";
import { z } from "zod";

import { models } from "@/ai/models";
import {
	deleteChatById,
	getChatById,
	saveChat,
	saveMessages,
} from "@/db/queries";
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from "@/lib/utils";

import { getSessionId } from "@/app/(auth)/sessionid";
import {
	logBotBegin,
	logRetrieval,
} from "@proemial/adapters/analytics/helicone";
import { generateEmbedding } from "@proemial/adapters/llm/embeddings";
import LlmModels from "@proemial/adapters/llm/models";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import { Time } from "../../../../../../packages/utils/time";
import { generateTitleFromUserMessage } from "../../actions";
import {
	followUpQuestionsPrompt,
	rephraseQuestionPrompt,
	systemPrompt,
} from "./prompts";

export const maxDuration = 60;

export type RetrievalResult = Array<{
	link: string;
	title: string;
	abstract: string;
	publicationDate: string;
	index?: number;
}>;

type AllowedTools = "getPapers";

const allTools: AllowedTools[] = ["getPapers"];

export async function POST(request: Request) {
	const {
		id,
		messages,
		modelId,
	}: { id: string; messages: Array<Message>; modelId: string } =
		await request.json();

	const sessionId = await getSessionId();

	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const model = models.find((model) => model.id === modelId);

	if (!model) {
		return new Response("Model not found", { status: 404 });
	}

	const coreMessages = convertToCoreMessages(messages);
	const userMessage = getMostRecentUserMessage(coreMessages);

	if (!userMessage) {
		return new Response("No user message found", { status: 400 });
	}
	// We only support text messages for now
	if (typeof userMessage.content !== "string") {
		return new Response("User message must be a string", { status: 400 });
	}
	const question = userMessage.content;

	const chat = await getChatById({ id });

	if (!chat) {
		const title = await generateTitleFromUserMessage({ message: userMessage });
		await saveChat({ id, userId: sessionId, title });
	}

	const userMessageId = generateUUID();
	await saveMessages({
		messages: [
			{
				...userMessage,
				id: userMessageId,
				createdAt: new Date(),
				chatId: id,
				extra: null,
			},
		],
	});

	const streamingData = new StreamData();

	const papers: Array<{
		link: string;
		title: string;
		abstract: string;
		publicationDate: string;
	}> = [];

	const traceId = generateUUID();

	await logBotBegin("chat", userMessage.content, traceId);

	const result = await streamText({
		model: await LlmModels.chat.answer(traceId),
		system: systemPrompt,
		tools: {
			getPapers: {
				description: "Get scientific research papers relevant to a question",
				parameters: z.object({
					question: z.string(),
				}),
				execute: async ({ question }) => {
					const { text: rephrasedQuestion } = await generateText({
						model: await LlmModels.chat.rephrase(traceId),
						system: rephraseQuestionPrompt(question),
						messages: coreMessages,
					});

					return (await logRetrieval(
						"chat",
						rephrasedQuestion,
						async <RetrievalResult>() => {
							return (await getPapersFromQdrant(
								rephrasedQuestion,
							)) as RetrievalResult;
						},
						traceId,
					)) as RetrievalResult;
				},
			},
		},
		experimental_activeTools: allTools,
		messages: coreMessages,
		maxSteps: 5,
		onStepFinish({ toolResults }) {
			const matchedPapers = toolResults.find(
				(r) => r.toolName === "getPapers",
			)?.result;

			if (matchedPapers) {
				papers.push(...matchedPapers);
				streamingData.append({
					type: "papers-fetched",
					transactionId: userMessageId,
					data: {
						papers,
					},
				});
			}
		},
		onFinish: async ({ responseMessages, text: answer }) => {
			const { object: followUpQuestions } = await generateObject({
				model: await LlmModels.chat.followups(traceId),
				output: "array",
				schema: z.object({
					question: z
						.string()
						.describe("A follow up question to the user's question"),
				}),
				prompt: followUpQuestionsPrompt(question, answer),
			});

			if (followUpQuestions?.length) {
				streamingData.append({
					type: "follow-up-questions-generated",
					transactionId: userMessageId,
					data: followUpQuestions,
				});
			}

			if (sessionId) {
				try {
					const responseMessagesWithoutIncompleteToolCalls =
						sanitizeResponseMessages(responseMessages);

					await saveMessages({
						messages: responseMessagesWithoutIncompleteToolCalls.map(
							(message) => {
								const messageId = generateUUID();

								if (message.role === "assistant") {
									streamingData.appendMessageAnnotation({
										messageIdFromServer: messageId,
									});
								}

								const isAssistantAnswer =
									message.role === "assistant" &&
									typeof message.content !== "string" &&
									message.content[0].type === "text";

								return {
									id: messageId,
									chatId: id,
									role: message.role,
									content: message.content,
									createdAt: new Date(),
									// Only add follow ups if the message is an assistant answer text (e.g. not a tool call)
									extra: isAssistantAnswer
										? { followUps: followUpQuestions.map((f) => f.question) }
										: null,
								};
							},
						),
					});
				} catch (error) {
					console.error("Failed to save chat");
				}
			}

			streamingData.close();
		},
		experimental_telemetry: {
			isEnabled: true,
			functionId: "stream-text",
		},
	});

	return result.toDataStreamResponse({
		data: streamingData,
	});
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return new Response("Not Found", { status: 404 });
	}

	const sessionId = await getSessionId();

	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const chat = await getChatById({ id });

		if (chat.userId !== sessionId) {
			return new Response("Unauthorized", { status: 401 });
		}

		await deleteChatById({ id });

		return new Response("Chat deleted", { status: 200 });
	} catch (error) {
		return new Response("An error occurred while processing your request", {
			status: 500,
		});
	}
}

const getPapersFromQdrant = async (query: string) => {
	const begin = Time.now();

	const embeddings = await generateEmbedding(LlmModels.chat.embeddings(), [
		query,
	]);

	try {
		const result = await QdrantPapers.search(embeddings);
		if (!result.papers) {
			return [];
		}

		return result.papers.map((paper) => ({
			link: `oa/${paper.paper.id.split("/").at(-1)}`,
			title: paper.paper.title,
			abstract: paper.paper.abstract ?? "",
			publicationDate: paper.paper.publication_date ?? "",
		}));
	} finally {
		Time.log(begin, `[qdrant][search] ${query}`);
	}
};
