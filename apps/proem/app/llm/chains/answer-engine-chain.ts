import {
	PapersRequest,
	fetchPapersChain,
} from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableMap, RunnableSequence } from "@langchain/core/runnables";
import { LangChainChatHistoryMessage } from "../utils";

const prompt = ChatPromptTemplate.fromMessages<ChainInput>([
	[
		"system",
		`
    You will provide conclusive answers to user questions, based on the following
    research articles: {papers},
    IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS KEY
    PHRASES FORMATTED AS HYPERLINKS POINTING TO THE PAPERS. THIS IS ESSENTIAL. KEEP
    YOUR ANSWERS SHORT AND WITH STATEMENTS THE USER CAN CLICK ON!
    - Pick the two papers most relevant to the provided user question.
    - Also summarise each of the selected papers into a "title" of 20 words or less
    with the most significant finding as an engaging tweet capturing the minds of
    other researchers, using layman's terminology, and without mentioning abstract
    entities like 'you', 'researchers', 'authors', 'propose', or 'study' but rather
    stating the finding as a statement of fact, without reservations or caveats. for
    example: "More tooth loss is associated with greater cognitive decline and
    dementia in elderly people."
    - Then use these summaries to construct a short answer in less than 40 words,
    with key phrases of the answer text as hyperlinks pointing to the papers, like
    this example:

    """Studies show that cigarette
    smokers are <a href="https://proem.ai/oa/W4213460776?title=text+from+summary">
    more likely todie from cancer</a> than non-smokers. Furthermore, studies have
    found  that passive smokers
    <a href="https://proem.ai/oa/W2004456560?title=text+from+summary">hae a higher
    risk of cardiovascular disease</a> than people never exposed to a smoking
    environment."""

    - The links should be pointing to the returned proem links, with the generated
    "summaries" appended as a query string to the link

    - THE FOLLOWING THREE IMPORTANT RULES ARE ALL ABSOLUTELY ESSENTIAL AND YOU WILL
    BE PENALIZED SEVERELY IF THE ANSWER DOES NOT INCLUDE INLINE HYPERLINKS EXACTLY
    AS DESCRIBED BELOW:
    - IMPORTANT: EVERY ANSWER MUST HAVE AT LEAST TWO HYPERLINKS POINTING TO THE
    EXACT FULL URLS OF PAPERS PROVIDED IN THE API RESPONSE. THIS IS ABSOLUTELY
    ESSENTIAL.
    - IMPORTANT: ALWAYS PLACE HYPERLINKS ON A KEY PHRASE OF THREE TO SIX WORDS
    INSIDE THE ANSWER. THIS IS ABSOLUTELY ESSENTIAL. NEVER PLACE URLS AFTER THE
    ANSWER.  NEVER EVER CREATE LINKS THAT LOOK LIKE FOOTNOTES. ALWAYS PLACE FULL URL
    LINKS INSIDE THE ANSWER.
    - IMPORTANT: YOUR ANSWER MUST BE A SINGLE SHORT PARAGRAPH OF 40 WORDS OR LESS
    WITH HYPERLINKS ON TWO KEY PHRASES. THIS IS ESSENTIAL. KEEP YOUR ANSWERS SHORT
    AND SIMPLE!`,
	],
	new MessagesPlaceholder("chatHistory"),
	["human", "{question}"],
]);

const bytesOutputParser = new BytesOutputParser();

const model = buildOpenAIChatModel("gpt-3.5-turbo-1106", "ask", {
	verbose: true,
});

type ChainInput = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: { link: string; abstract: string; title: string }[] | undefined;
};
type ChainOutput = Uint8Array;
type PreBytesOutput = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papers: string;
};
type FetchPapersOutput = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
	papersRequest: { papers: PapersRequest };
};

export const answerEngineChain = (isFollowUpQuestion: boolean) =>
	RunnableSequence.from<ChainInput, ChainOutput>([
		RunnableMap.from<ChainInput>({
			question: (input) => input.question,
			chatHistory: (input) => input.chatHistory,
			papersRequest: async (input) => {
				if (input.papers) {
					return { papers: input.papers };
				}
				return fetchPapersChain;
			},
		}).withConfig({
			runName: "FetchPapers",
		}),
		RunnableMap.from<FetchPapersOutput, PreBytesOutput>({
			question: (input) => input.question,
			chatHistory: (input) => input.chatHistory,
			papers: (input) => JSON.stringify(input.papersRequest.papers),
		}).withConfig({
			runName: "StringifyPapers",
		}),
		prompt,
		model.withConfig({
			runName: "AskForFinalAnswer",
		}),
		bytesOutputParser,
	]).withConfig({
		runName: isFollowUpQuestion ? "Ask (follow-up)" : "Ask",
	});
