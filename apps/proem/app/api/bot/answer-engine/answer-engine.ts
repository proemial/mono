import { fetchPapersChain } from "@/app/api/bot/answer-engine/fetch-papers-chain";
import { model } from "@/app/api/bot/answer-engine/model";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Run } from "@langchain/core/tracers/base";
import { neonDb } from "@proemial/data";
import { NewAnswer, answers } from "@proemial/data/neon/schema/answers";
import {
  StreamingTextResponse,
  createStreamDataTransformer,
  experimental_StreamData,
} from "ai";
import { eq } from "drizzle-orm";

const bytesOutputParser = new BytesOutputParser();

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

const chatChain = chatPrompt.pipe(model);

type ChatHistory = { role: string; content: string }[];

type AnswerEngineChainInput = {
  question: string;
  chatHistory: ChatHistory;
  papers?: PapersRequest["papers"];
};

const conversationalAnswerEngineChain =
  RunnableSequence.from<AnswerEngineChainInput>([
    {
      question: (input) => input.question,
      chatHistory: (input) =>
        input.chatHistory.map((message) => {
          switch (message.role) {
            case "user":
              return new HumanMessage({ content: message.content });
            case "assistant":
            default:
              return new AIMessage({ content: message.content });
          }
        }),
      papersRequest: async (input) => {
        if (input.papers) {
          return { papers: input.papers };
        }

        const request = await fetchPapersChain.invoke({
          question: input.question,
        });

        return request;
      },
    },
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
      papers: (input) => JSON.stringify(input.papersRequest.papers),
    },
    chatChain,
    bytesOutputParser,
  ]);

type PapersRequest = {
  query: { keyConcept: string; relatedConcepts: string[] };
  papers: { link: string; abstract: string; title: string }[];
};

export type AnswerEngineParams = AnswerEngineChainInput & {
  existingSlug?: string;
};

export async function askAnswerEngine({
  existingSlug,
  question,
  chatHistory,
}: AnswerEngineParams) {
  const data = new experimental_StreamData();
  const slug = existingSlug ?? prettySlug(question);
  const existingAnswers = await neonDb
    .select()
    .from(answers)
    .where(eq(answers.slug, slug));

  const existingPapers = existingAnswers[0]?.papers?.papers;

  data.append({
    slug,
  });

  const stream = await conversationalAnswerEngineChain
    .withListeners({
      onEnd: async (run: Run) => {
        const valuesFromCurrentChain = (
          run.child_runs as any as {
            inputs: {
              content: string;
              papersRequest: PapersRequest;
            };
          }[]
        ).reduce(
          (acc, cur) => {
            const answer = acc.answer || cur.inputs.content;
            const papersRequest = acc.papersRequest || cur.inputs.papersRequest;

            return {
              ...acc,
              papersRequest,
              answer,
            };
          },
          {
            answer: null,
            papersRequest: null,
          } as {
            answer: string | null;
            papersRequest: PapersRequest | null;
          }
        );

        const newAnswer: NewAnswer = {
          answer: valuesFromCurrentChain.answer!,
          keyConcept: valuesFromCurrentChain.papersRequest!.query.keyConcept,
          relatedConcepts:
            valuesFromCurrentChain.papersRequest!.query.relatedConcepts,
          papers: {
            papers: valuesFromCurrentChain.papersRequest!.papers,
          },
          slug,
          question,
          // TODO! add ownerId
          // ownerId,
        };

        await neonDb.insert(answers).values(newAnswer);
      },
    })
    .stream(
      {
        chatHistory,
        question,
        papers: existingPapers,
      },
      {
        callbacks: [
          {
            handleChainEnd(_outputs, _runid, parentRunId) {
              if (parentRunId == null) {
                data.close();
              }
            },
          },
        ],
      }
    );

  return new StreamingTextResponse(
    stream.pipeThrough(createStreamDataTransformer(true)),
    {},
    data
  );
}
