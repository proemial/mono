import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@clerk/nextjs/server";
import {
	convertToCoreMessages,
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
		const coreMessages = convertToCoreMessages(messages);
		const slug = existingSlug ?? prettySlug(userQuestion.content);

		const streamingData = new StreamData() as AnswerEngineStreamData;
		streamingData.append({
			type: "answer-slug-generated",
			transactionId: userQuestion.id,
			data: { slug },
		});

		const result = await streamText({
			model: anthropic("claude-3-5-sonnet-20240620"),
			system: systemPrompt,
			messages: coreMessages,
			maxSteps: 5,
			tools: {
				getPapers: {
					description: "Get scientific research papers relevant to a question",
					parameters: z.object({
						question: z.string(),
					}),
					execute: async ({ question }) => {
						const { text: rephrasedQuestion } = await generateText({
							model: anthropic("claude-3-5-sonnet-20240620"),
							system: rephraseQuestionPrompt(question),
							messages: coreMessages,
						});
						return await getPapersFromQdrant(rephrasedQuestion);
					},
				},
			},
			onStepFinish({ toolResults }) {
				const papers = toolResults
					.filter((res) => res.toolName === "getPapers")
					.flatMap((res) => {
						const { result: papers } = res;
						return papers;
					});
				streamingData.append({
					type: "papers-fetched",
					transactionId: userQuestion.id,
					data: {
						papers,
					},
				});
			},
			onFinish: async ({ text: answer, toolResults }) => {
				const { text: followUpsStr } = await generateText({
					model: anthropic("claude-3-5-sonnet-20240620"),
					system: followUpQuestionsPrompt(userQuestion.content, answer),
					messages: coreMessages,
				});
				const followUps = followUpsStr
					.split("?")
					.filter(Boolean)
					.map((question) => ({ question: `${question.trim()}?` }));
				streamingData.append({
					type: "follow-up-questions-generated",
					transactionId: userQuestion.id,
					data: followUps,
				});

				const papers = toolResults
					.filter((res) => res.toolName === "getPapers")
					.flatMap((res) => {
						const { result: papers } = res;
						return papers;
					});

				const { userId } = auth();

				const savedAnswer = await answers.create({
					slug,
					question: userQuestion.content,
					answer,
					ownerId: userId,
					papers: { papers },
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

				streamingData.close();
			},
		});

		return result.toDataStreamResponse({
			data: streamingData,
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};

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
