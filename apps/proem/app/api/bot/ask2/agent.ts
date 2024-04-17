import { AnswerEngineStreamData } from "@/app/api/bot/answer-engine/answer-engine";
import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { askAgentPrompt } from "@/app/prompts/ask_agent";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { Run } from "langsmith";
import { saveAnswerFromAgent } from "../answer-engine/save-answer";

export const buildAgent = async (
	params: {
		isFollowUpQuestion: boolean;
		slug: string;
		userInput: string;
		tags?: string[];
		transactionId: string;
		userId?: string;
	},
	tools: DynamicTool[],
	data: AnswerEngineStreamData,
) => {
	const prompt = ChatPromptTemplate.fromMessages([
		["system", askAgentPrompt],
		new MessagesPlaceholder("chatHistory"),
		["human", "{input}"],
		new MessagesPlaceholder("agent_scratchpad"),
	]);
	const isGpt4FeatureEnabled = (await getFeatureFlag("askGpt4")) ?? false;
	const llm = buildOpenAIChatModel(
		isGpt4FeatureEnabled ? "gpt-4-0125-preview" : "gpt-3.5-turbo-0125",
		"ask",
		{ temperature: 0.0, streaming: true },
	);
	const { isFollowUpQuestion, slug, userInput, tags, transactionId, userId } =
		params;

	return (await createOpenAIFunctionsAgent({ llm, tools, prompt }))
		.withConfig({
			tags,
			metadata: {
				userId,
			},
		})
		.withListeners({
			onEnd: async (run: Run) => {
				const tool = run.outputs?.tool as string | undefined;
				const answer = run.outputs?.returnValues?.output as string | undefined;

				if (tool) {
					// Agent selected a tool
					data.append({
						type: "agent-selected-tool",
						transactionId,
						data: {
							tool,
						},
					});
				} else if (answer) {
					// Agent provided an answer
					const saveAnswerPromise = saveAnswerFromAgent({
						question: userInput,
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

					const followUpsQuestionPromise = followUpQuestionChain
						.invoke({
							question: userInput,
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
					Promise.all([saveAnswerPromise, followUpsQuestionPromise]).then(
						() => {
							data.close();
						},
					);
				}
			},
		});
};
