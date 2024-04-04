import type { PapersAsString } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import type { LangChainChatHistoryMessage } from "../utils";

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
    You are a helpful assistant that provides conclusive answers to user
    questions, based on research papers provided by the user. Each research
    paper has an associated link.

		You must follow these steps when constructing your answer:

		1. Summarize the two research articles most relevant to the user's
		question into 20 words or less, with the most significant finding as an
		engaging tweet capturing the minds of other researchers. Use layman's
		terminology, without mentioning abstract entities like "you",
		"researchers", "authors", "propose", or "study", but rather stating the
		finding as a statement of fact, without reservations or caveats.

		Example of a summary:

		"""
		More tooth loss is associated with greater cognitive decline and
		dementia in elderly people.
		"""

		2. Based on these two summaries, construct two Markdown links pointing to
		each of the associated research articles. The title of a link must be a key
		phrase from the summary and consist of 3-6 words. This title must also be
		appended to the link destination as a \`title\` query parameter.

		3. Finally, based on these two summaries and the two links, construct
		your answer spanning no more than 40 words. Your answer must include the links
		intertwined with the rest of the text.

		Example of your answer:

		"""
    Studies show that cigarette smokers are
		[more likely to die from cancer](/oa/W4213460776?title=smoking+frequency)
		than non-smokers. Furthermore, studies have found that passive smokers
		[have a higher risk of cardiovascular disease](/oa/W2004456560?title=passive+smoking+health+risks)
		than people never exposed to a smoking environment.
		"""

		Rules:
		- Your answer must include exactly two links as described above; one for
		each article. This is absolutely essential. The links should be in-line,
		highlighting words of the sentences that consitute your answer.
		- Do not format your whole answer as Markdown, just the links.
		- Your answer must be a single, short paragraph of 40 words or less.
		- Do not begin your answer with a number.
`,
	],
	new MessagesPlaceholder("chatHistory"),
	["human", "Question: {question}\n\nResearch papers: {papers}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

const stringOutputParser = new StringOutputParser();

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: PapersAsString;
};

export const getGenerateAnswerChain = (modelOverride: BaseChatModel = model) =>
	prompt
		.pipe(modelOverride)
		.pipe(stringOutputParser)
		.withConfig({ runName: "GenerateAnswer" });
