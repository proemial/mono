import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import * as hub from "langchain/hub";
import { PapersAsString } from "./fetch-papers/fetch-papers-chain";

const hubPrompt = await hub.pull("proemial/ask-answer-prompt:130ba7cd");

type Input = {
	question: string;
	papers: PapersAsString;
};

const digestivePrompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
You are a helpful high school teacher that provides conclusive answers to a
user's question, based on scientific research papers provided by the user and
your general knowledge.

If the user is asking a quesion, base your answer on the two research papers
most relevant to the user's question. If you find it necessary, include an
introduction to the topic of the user's question, using a single sentence.

If you base your answer on the research papers, append the links of these two
research papers beneath your answer, refering to them by number.

However, if a user is not asking a question, or your answer is not based on
research papers, reply in a friendly manner without using the provided research
papers and without including links beneath your answer.

Rules:
- Your answer must not exceed 40 words.
- Your answer must be using layman's terminology, instead of scientific jargon.
- Act as if you found the research yourself.

Example:

---
User question: What are the laws of thermodynamics?

Your answer: The laws of thermodynamics, derived from historical principles and
refined through scientific inquiry, govern energy transfer and entropy. They are
essential in understanding both equilibrium and non-equilibrium processes, as
well as the behavior of systems from classical to quantum scales.

[1](/oa/W2088834980?title=1)[2](/oa/W2074335107?title=2)
---
`,
	],
	["human", "Question: {question}\n\nResearch papers: {papers}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const generateAnswerChain = (modelOverride: BaseChatModel = model) =>
	RunnableLambda.from(async () => {
		const isDigestibleAnswersEnabled =
			await getFeatureFlag("digestibleAnswers");
		const prompt = isDigestibleAnswersEnabled ? digestivePrompt : hubPrompt;
		return prompt
			.pipe(modelOverride)
			.pipe(new StringOutputParser())
			.withConfig({ runName: "GenerateAnswer" });
	});
