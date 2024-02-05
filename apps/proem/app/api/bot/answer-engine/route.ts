import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { fetchPapers } from "@/app/api/paper-search/search";
import { organizations } from "@/app/prompts/openai-keys";
import {
  AIMessage,
  BaseMessageChunk,
  HumanMessage,
} from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getBuildSearchParamsChain } from "./chains/build-search-params-chain";

export const runtime = "edge";

const model = new ChatOpenAI(
  {
    // TODO! Figure out different temperature settings?
    temperature: 0.8,
    modelName: "gpt-3.5-turbo-1106",
    cache: true,
    verbose: true,
  },
  // Not really sure if this works, so ASK has also been set as the default organisation in the OpenAI admin panel
  { organization: organizations.ask }
);

const bytesOutputParser = new BytesOutputParser();

type ChatHistoryItem = { role: string; content: string };

type AnswerEngineChainInput = {
  question: string;
  chatHistory: (HumanMessage | AIMessage)[];
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: ChatHistoryItem[] = body.messages ?? [];
  const chatHistory = messages.slice(0, -1).map(toLangChainChatHistory);
  const currentMessageContent = messages[messages.length - 1]!.content;

  const chatPrompt = ChatPromptTemplate.fromMessages<AnswerEngineChainInput>([
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

"""Yes/No. Smoking causes/does not cause cancer. Studies show that cigarette
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
    ["human", `{question}`],
  ]);

  const conversationalAnswerEngineChain = RunnableSequence.from<
    AnswerEngineChainInput,
    BaseMessageChunk
  >([
    {
      // TODO: To save time, how do we pass through the object with both
      // `question` and `chatHistory`?
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
      searchParams: getBuildSearchParamsChain(model),
    },
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
      papers: async (input) => {
        if (!input.searchParams) {
          return "[]";
        }

        const { keyConcept, relatedConcepts } = input.searchParams;
        const oaSearchQuery = convertToOASearchString(
          keyConcept,
          relatedConcepts
        );

        // TODO: Fix 0 paper results breaking the pipeline
        const papers = await fetchPapers(oaSearchQuery);
        // TODO: This should be better encapsulated
        const papersWithRelativeLinks = papers?.map((paper) => ({
          ...paper,
          link: paper.link.replace("https://proem.ai", ""),
        }));

        return JSON.stringify(papersWithRelativeLinks);
      },
    },
    chatPrompt,
    model,
  ]);

  const stream = await conversationalAnswerEngineChain
    .pipe(bytesOutputParser)
    .stream({
      question: currentMessageContent,
      chatHistory,
    });

  return new StreamingTextResponse(stream);
}

const toLangChainChatHistory = (item: ChatHistoryItem) =>
  item.role === "user"
    ? new HumanMessage(item.content)
    : new AIMessage(item.content);
