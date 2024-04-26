import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type FollowUpQuestionChainInput = {
	question: string;
	answer: string;
};

const systemPrompt = `
Based on a given question and an answer to that question, provide a response containing three good follow-up questions that would enable an adult learner dive deeper into a topic and understand the background for the given answer.

The first question should dive deeper into the topic.
The second question should challenge the facts presented in the answer.
The third question should broaden the user's knowledge on the topic.

Rules:
- Each of the three follow-up questions must not exceed ten words.
- Respond only with the three follow-up questions.

Example:

---
Human: How does life work?
Assistan: Life works through complex processes, including the biological aging modeled by Gompertz and the developmental plasticity that allows organisms to adapt to their environment, influenced by genetics and early life events.
Response: What are the key components of the model? Are there any alternative theories to it? How do genetics interact in shaping an organism's development?
---
`;

const prompt = ChatPromptTemplate.fromMessages<FollowUpQuestionChainInput>([
	["system", systemPrompt],
	["human", "{question}"],
	["assistant", "{answer}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const followUpQuestionChain = (modelOverride: BaseChatModel = model) =>
	prompt
		.pipe(modelOverride)
		.pipe(new StringOutputParser())
		.withConfig({ runName: "GenerateFollowUpQuestions" });
