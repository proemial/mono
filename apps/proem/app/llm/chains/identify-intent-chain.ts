import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { buildOpenAIChatModel } from "../models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
		Given a user question, identify the action from the list below that best
		describes the user's expectation based on their question:

		---
		Action: \`ANSWER_EVERYDAY_QUESTION\`
		Description: Give an answer to an everyday question.

		Action: \`ANSWER_FOLLOWUP_QUESTION\`
		Description: Give an answer to a previously-asked question.

		Action: \`EXPLAIN_CONCEPT\`
		Description: Explain a key concept.

		Action: \`FIND_PAPER\`
		Description: Find a specific research paper.

		Action: \`FIND_LATEST_PAPERS\`
		Description: Find the latest research papers within a broad domain.

		Action: \`FIND_INFLUENTIAL_PAPERS\`
		Description: Find the most influential research papers on a specific topic.

		Action: \`FIND_PAPERS_BY_AUTHOR\`
		Description: Find all research papers by a specific author.

		Action: \`FIND_PAPERS_CITING_A_GIVEN_PAPER\`
		Description: Find all research papers citing a given research paper.

		Action: \`UNKNOWN\`
		Description: Unsure or none of the above.
		---

		Example answer 1:

		---
		ANSWER_EVERYDAY_QUESTION
		---

		Example answer 2:

		---
		ANSWER_FOLLOWUP_QUESTION
		---

		Example answer 3:

		---
		EXPLAIN_CONCEPT
		---

		Rules:
		- Respond ONLY with the action of the matching item from the list above.
		- If you are unsure which action best matches the user's request, respond
			with \`UNKNOWN\`.
	`,
	],
	["human", "User question: {question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

type Input = { question: string };

export const getIdentifyIntentChain = (modelOverride: BaseChatModel = model) =>
	prompt.pipe(modelOverride).pipe(new StringOutputParser()).withConfig({
		runName: "IdentifyIntent",
	});
