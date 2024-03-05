import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { LangChainChatHistoryMessage } from "../utils";

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
    You are a helpful assistant that provides conclusive answers to user
    questions, based on the following research papers: <papers>{papers}</papers>. Each research
    paper has an associated link. If you have no research paper, decline to
    answer the user's question in a friendly manner stating you have
    insufficient research available on the topic.

		You must follow these steps when constructing your answer:

		1. Summarize each of the selected research articles into 20 words or
		less, with the most significant finding as an engaging tweet capturing
		the minds of other researchers. Use layman's terminology, without
		mentioning abstract entities like "you", "researchers", "authors",
		"propose", or "study", but rather stating the finding as a statement of
		fact, without reservations or caveats.

		Example of a summary:

		"""
		More tooth loss is associated with greater cognitive decline and
		dementia in elderly people.
		"""

		2. Based on these two summaries, construct two Markdown links pointing to
		each the associated research articles. The title of a link must be a key
		phrase from the summary and consist of 3-6 words. This title must also be
		appended to the link destination as a \`title\` query parameter.

		3. Finally, based on these two summaries and the two links, construct
		your answer spanning no more than 40 words. Your answer must include the links
		intertwined with the text of the answer.

		Example of your answer:

		"""
    Studies show that cigarette smokers are
		[more likely to die from cancer](/oa/W4213460776?title=smoking+frequency)
		than non-smokers. Furthermore, studies have found that passive smokers
		[have a higher risk of cardiovascular disease](/oa/W2004456560?title=passive+smoking+health+risks)
		than people never exposed to a smoking environment.
		"""

		Rules:
		- Your answer must include at least two links as described above. This
		is absolutely essential.
		- Do not format your whole answer as Markdown, just the links.
		- Your answer must be a single, short paragraph of 40 words or less.`,
	],
	new MessagesPlaceholder("chatHistory"),
	["human", "{question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
});

const stringOutputParser = new StringOutputParser();

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: string;
};

export const getGenerateAnswerChain = (modelOverride: BaseChatModel = model) =>
	prompt
		.pipe(modelOverride)
		.pipe(stringOutputParser)
		.withConfig({ runName: "GenerateAnswer" });
