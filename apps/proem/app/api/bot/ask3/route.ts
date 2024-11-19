import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import {
	convertToCoreMessages,
	generateObject,
	generateText,
	Message,
	StreamData,
	streamText,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodType } from "zod";
import {
	followUpQuestionsPrompt,
	rephraseQuestionPrompt,
	systemPrompt,
} from "./prompts";
import { Time } from "@proemial/utils/time";
import { QdrantPaper } from "../../news/annotate/fetch/steps/fetch";
import { AnswerEngineStreamData } from "../answer-engine/answer-engine";
import { prettySlug } from "@proemial/utils/pretty-slug";
import { answers } from "@proemial/data/repository/answer";
import {
	llmTrace,
	Span,
	wrapAISDKModel,
	wrapTraced,
} from "@/components/analytics/braintrust/llm-trace";

export const maxDuration = 30;

const RequestDataSchema = z.object({
	messages: z.array(
		z.object({
			id: z.string(),
			content: z.string(),
			role: z.enum(["user", "assistant"]),
		}),
	) satisfies ZodType<Array<Message>>,
	slug: z.string().optional(),
});

llmTrace.init(llmTrace.projects.Ask);

export const POST = async (req: NextRequest) => {
	try {
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}

		const requestData = await req.json();
		const { messages, slug: existingSlug } =
			RequestDataSchema.parse(requestData);
		const userQuestion = getMostRecentUserMessage(messages);
		if (!userQuestion) {
			return new Response("No user question found", { status: 400 });
		}
		const slug = existingSlug ?? prettySlug(userQuestion.content);

		return llmTrace.trace(
			(span) => {
				return streamAnswer(userQuestion, messages, slug, span);
			},
			{ name: "ASK Answer" },
		);
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};

async function streamAnswer(
	userQuestion: Message,
	messages: Array<Message>,
	slug: string,
	trace: Span,
) {
	const coreMessages = convertToCoreMessages(messages);

	const streamingData = new StreamData() as AnswerEngineStreamData;
	streamingData.append({
		type: "answer-slug-generated",
		transactionId: userQuestion.id,
		data: { slug },
	});

	const papers: Array<{
		link: string;
		title: string;
		abstract: string;
		publicationDate: string;
	}> = [];

	const result = await streamText({
		model: wrapAISDKModel(google("gemini-1.5-flash")),
		system: systemPrompt,
		messages: coreMessages,
		maxSteps: 5,
		tools: {
			getPapers: {
				description: "Get scientific research papers relevant to a question",
				parameters: z.object({
					question: z.string(),
				}),
				execute: wrapTraced(async ({ question }) => {
					const { text: rephrasedQuestion } = await generateText({
						model: wrapAISDKModel(google("gemini-1.5-flash")),
						system: rephraseQuestionPrompt(question),
						messages: coreMessages,
					});
					console.log("rephrasedQuestion", rephrasedQuestion);
					return await getPapersFromQdrant(rephrasedQuestion);
				}),
			},
		},
		onStepFinish({ toolResults }) {
			const matchedPapers = toolResults.find(
				(r) => r.toolName === "getPapers",
			)?.result;

			if (matchedPapers) {
				papers.push(...matchedPapers);
				streamingData.append({
					type: "papers-fetched",
					transactionId: userQuestion.id,
					data: {
						papers,
					},
				});
			}
		},
		onFinish: async ({ text: answer }) => {
			console.log("answer", answer);
			const { object: followUpQuestions } = await generateObject({
				model: wrapAISDKModel(google("gemini-1.5-flash")),
				output: "array",
				schema: z.object({
					question: z
						.string()
						.describe("A follow up question to the user's question"),
				}),
				prompt: followUpQuestionsPrompt(userQuestion.content, answer),
			});
			console.log("followUpQuestions", followUpQuestions);

			if (followUpQuestions?.length) {
				streamingData.append({
					type: "follow-up-questions-generated",
					transactionId: userQuestion.id,
					data: followUpQuestions,
				});
			}

			const { userId } = auth();

			const savedAnswer = await answers.create({
				slug,
				question: userQuestion.content,
				answer,
				ownerId: userId,
				papers: { papers },
				followUpQuestions,
			});
			if (!savedAnswer) {
				throw new Error("Failed to save answer");
			}
			streamingData.append({
				type: "answer-saved",
				transactionId: userQuestion.id,
				data: {
					shareId: savedAnswer.shareId,
					runId: "deprecated",
				},
			});

			trace.log({
				input: userQuestion.content,
				output: answer,
				tags: ["answer"],
			});

			streamingData.close();
		},
	});

	return result.toDataStreamResponse({
		data: streamingData,
	});
}

const getMostRecentUserMessage = (messages: Array<Message>) => {
	const userMessages = messages.filter((message) => message.role === "user");
	return userMessages.at(-1);
};

const getPapersFromQdrant = async (query: string) => {
	const begin = Time.now();

	try {
		const papersResult = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: query,
				from: "2024-01-01",
				extended: true,
			}),
		});

		const { papers } = (await papersResult.json()) as { papers: QdrantPaper[] };
		console.log("Papers", papers.length);

		return papers.map((paper) => ({
			link: `oa/${paper.id.split("/").at(-1)}`,
			title: paper.title,
			abstract: paper.abstract,
			publicationDate: paper.published,
		}));
	} finally {
		Time.log(begin, `[qdrantQuery] ${query}`);
	}
};
