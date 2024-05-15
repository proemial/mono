import { AnswerEngineStreamData } from "@/app/api/bot/answer-engine/answer-engine";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { askAgentPrompt } from "@/app/prompts/ask_agent";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { DynamicTool } from "@langchain/core/tools";
import { createOpenAIFunctionsAgent } from "langchain/agents";
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
	const modelId = getInternalUser().isInternal
		? "gpt-4o"
		: "gpt-4-0125-preview";
	const llm = buildOpenAIChatModel(modelId, "ask", {
		temperature: 0.0,
		streaming: true,
	});
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
						return insertedAnswer;
					});

					const followUpsQuestionPromise = followUpQuestionChain()
						.invoke({
							question: userInput,
							answer,
						})
						.then((response) => {
							const followUpQuestions = response
								.split("?")
								.filter(Boolean)
								.map((question) => ({ question: `${question.trim()}?` }));

							data.append({
								type: "follow-up-questions-generated",
								transactionId,
								data: followUpQuestions,
							});

							return followUpQuestions;
						});

					Promise.all([saveAnswerPromise, followUpsQuestionPromise]).then(
						async ([insertedAnswer, followUpQuestions]) => {
							if (insertedAnswer && followUpQuestions) {
								await answers.update(insertedAnswer.id, { followUpQuestions });
							}

							// Waiting for all sideeffects relying on data to finish before closing the data stream
							data.close();
						},
					);
				}
			},
		});
};
