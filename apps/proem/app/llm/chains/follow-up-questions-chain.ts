import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type FollowUpQuestionChainInput = {
	question: string;
	answer: string;
};

const systemPrompt = `
Based on a given question and an answer to that question, provide three good follow-up questions that would enable an adult learner dive deeper into a topic and understand the background for the given answer.

The first question should dive deeper into the topic.
The second question should challenge the facts presented in the answer.
The third question should broaden the user's knowledge on the topic.

Rules:
- Each of the three follow-up questions must not exceed 10 words.
- Respond only with the three follow-up questions.

Example:

---
Question: How does life work?
Answer: Life works through complex processes, including the biological aging modeled by Gompertz and the developmental plasticity that allows organisms to adapt to their environment, influenced by genetics and early life events.
Follow-up questions: What are the key components of Gompertz's aging model? Are there any alternative theories to Gompertz's model of aging? How do genetics and early life events interact in shaping an organism's development?
---
`;

const prompt = ChatPromptTemplate.fromMessages<FollowUpQuestionChainInput>([
	["system", systemPrompt],
	["human", "{question}"],
	["assistant", "{answer}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const getFollowUpQuestionChain = (
	modelOverride: BaseChatModel = model,
) =>
	prompt
		.pipe(modelOverride)
		.pipe(new StringOutputParser())
		.pipe(sanitizeFollowups)
		.withConfig({ runName: "GenerateFollowUpQuestions" });

export const followUpQuestionChain = getFollowUpQuestionChain();

function sanitizeFollowups(input: string) {
	const sanitized = input
		// Filter out newlines, quotes and empty strings, trim, and remove duplicates
		.replaceAll('"', "")
		.replaceAll("?", "")
		.split("\n")
		.map((value) => value.replace(/^[^a-zA-Z]+|\W+$/g, ""))
		.join("?");

	return sanitized;
}
