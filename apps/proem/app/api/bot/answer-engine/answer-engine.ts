import {
  StreamingTextResponse,
  createStreamDataTransformer,
  experimental_StreamData,
} from "ai";
import { Run } from "@langchain/core/tracers/base";

import { AnswerEngineChatMessageHistory } from "@/app/api/bot/answer-engine/answer-engine-memory";
import { convertToOASearchString } from "@/app/api/bot/answer-engine/convert-query-parameters";
import { parseFunctionCall } from "@/app/api/bot/answer-engine/parse-function-call";
import { fetchPapers } from "@/app/api/paper-search/search";
import {
  AIMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { model } from "@/app/api/bot/answer-engine/model";
import { fetchPapersChain } from "@/app/api/bot/answer-engine/fetch-papers-chain";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { config } from "process";
import { neonDb } from "../../../../../../packages/data";
import {
  NewAnswer,
  answers,
  insertAnswerSchema,
} from "../../../../../../packages/data/neon/schema/answers";

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
  // TODO! Hacky with hack-hack
  // ! fix langchain pipe
  new MessagesPlaceholder("chatHistory"),
  ["human", `{question}`],
]);

const chatChain = chatPrompt.pipe(model);
// const chatChainWithHistory = new RunnableWithMessageHistory({
//   runnable: chatChain,
//   getMessageHistory: (sessionId) =>
//     new AnswerEngineChatMessageHistory(sessionId),
//   inputMessagesKey: "question",
//   historyMessagesKey: "chatHistory",
// });

// const fetchPapersChainWithHistory = new RunnableWithMessageHistory({
//   runnable: fetchPapersChain,
//   getMessageHistory: (sessionId) =>
//     new AnswerEngineChatMessageHistory(sessionId),
//   inputMessagesKey: "papers",
//   outputMessagesKey: "papers",
//   historyMessagesKey: "fakeHistory?",
// });

type ChatHistory = { role: string; content: string }[];

type AnswerEngineChainInput = {
  sessionId: string;
  question: string;
  chatHistory: ChatHistory;
};

export type AnswerEngineParams = AnswerEngineChainInput;

const conversationalAnswerEngineChain =
  RunnableSequence.from<AnswerEngineChainInput>([
    {
      question: (input) => input.question,
      // TODO! remove
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
      papersRequest: async (input, { config: { configurable } }) => {
        // TODO! We should only fetch papers on the first run
        console.log(configurable);
        const request = await fetchPapersChain.invoke(
          {
            question: input.question,
          },
          {
            configurable: { sessionId: configurable.sessionId },
          }
        );

        console.log(request);
        return request;
        // return JSON.stringify(papers);
      },
      // test: (input, config) => {
      //   console.log(input);
      //   console.log(config);
      //   return fetchPapersChain.invoke({ question: input.question });
      // },
    },
    {
      papers: (input) => JSON.stringify(input.papersRequest.papers),
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
    },
    chatChain,
    bytesOutputParser,
  ]);

export async function askAnswerEngine({
  question,
  chatHistory,
  sessionId,
}: AnswerEngineParams) {
  // TODO! Check for cached item?
  // const cached = await kv.get(key);
  // if (cached) {
  //   return new Response(cached);
  // optional: emulate streaming https://sdk.vercel.ai/docs/concepts/caching

  const data = new experimental_StreamData();
  const memory = new AnswerEngineChatMessageHistory(sessionId);
  // const answerToSave = {
  //   question,
  //   sessionId,
  //   answer,
  //   papers,
  //   parent?
  // }

  data.append({
    sessionId,
  });

  const stream = await conversationalAnswerEngineChain
    .withListeners({
      onStart: (run: Run) => {
        console.log(run);
      },
      onEnd: async (run: Run) => {
        const newAnswer = run.child_runs.reduce(
          (acc, cur) => {
            const answer = acc.answer || cur.inputs.content;
            const paperRequests = acc.paperRequests || cur.inputs.papersRequest;
            return {
              ...acc,
              paperRequests,
              answer,
            };
          },
          {
            answer: null,
            paperRequests: null,
          }
        );

        console.log(newAnswer);
        const answerToSave: NewAnswer = {
          answer: newAnswer.answer!,
          keyConcept: newAnswer.paperRequests!.query.keyConcept,
          relatedConcepts: newAnswer.paperRequests!.query.relatedConcepts,
          papers: {
            papers: newAnswer.paperRequests!.papers,
          },
          slug: sessionId,
          question,
          // ownerId,
        };
        console.log({ answerToSave });
        // const parsedAnswer = insertAnswerSchema.parse(answerToSave);
        // console.log(parsedAnswer);

        // TODO! could batch +   .onConflictDoNothing();
        const returned = await neonDb.insert(answers).values(answerToSave);

        console.log(returned);

        const { extra, events, outputs, inputs, child_runs } = run;

        console.log(extra);
        console.log(events);
        console.log(outputs);
        console.log(inputs);
        console.log(child_runs.length);
        console.log(child_runs[0]);
        console.log(child_runs[1]);
        console.log(child_runs[2]);
        console.log(child_runs[3]);
        console.log(child_runs[0]?.child_runs);
        console.log(child_runs[1]?.child_runs);
        console.log(child_runs[2]?.child_runs);
        console.log(child_runs[3]?.child_runs);
        for (const child of child_runs) {
          // const paperOutput
          console.log(child?.serialized);
          console.log(child?.child_runs);
          console.log(child?.inputs);
          const aiContent = child.inputs.content;
          console.log(aiContent);
          const question = child.inputs.question;
          console.log(question);

          const paperRequests = child?.inputs?.papersRequest;
          console.log(paperRequests);
          /*
           papersRequest: {
      query: {
        keyConcept: 'sleep',
        relatedConcepts: [ 'sleep patterns', 'sleep deprivation', 'circadian rhythm', 'REM sleep', 'sleep disorders' ]
      },
      papers: Array(30) [
        {
          link: '/oa/W2118370586',
          abstract:
            'Actigraphy is increasingly used in sleep research and the clinical care of patients with sleep and circadian rhythm abnormalities. The following practice parameters update the previous practice parameters published in 2003 for the use of actigraphy in the study of sleep and circadian rhythms. Based upon a systematic grading of evidence, members of the Standards of Practice Committee, including those with expertise in the use of actigraphy, developed these practice parameters as a guide to the appropriate use of actigraphy, both as a diagnostic tool in the evaluation of sleep disorders and as an outcome measure of treatment efficacy in clinical settings with appropriate patient populations. Actigraphy provides an acceptably accurate estimate of sleep patterns in normal, healthy adult populations and inpatients suspected of certain sleep disorders. More specifically, actigraphy is indicated to assist in the evaluation of patients with advanced sleep phase syndrome (ASPS), delayed sleep phase syndrome (DSPS), and shift work disorder. Additionally, there is some evidence to support the use of actigraphy in the evaluation of patients suspected of jet lag disorder and non-24hr sleep/wake syndrome (including that associated with blindness). When polysomnography is not available, actigraphy is indicated to estimate total sleep time in patients with obstructive sleep apnea. In patients with insomnia and hypersomnia, there is evidence to support the use of actigraphy in the characterization of circadian rhythms and sleep patterns/disturbances. In assessing response to therapy, actigraphy has proven useful as an outcome measure in patients with circadian rhythm disorders and insomnia. In older adults (including older nursing home residents), in whom traditional sleep monitoring can be difficult, actigraphy is indicated for characterizing sleep and circadian patterns and to document treatment responses. Similarly, in normal infants and children, as well as special pediatric populations, actigraphy has proven useful for delineating sleep patterns and documenting treatment responses. Recent research utilizing actigraphy in the assessment and management of sleep disorders has allowed the development of evidence-based recommendations for the use of actigraphy in the clinical setting. Additional research is warranted to further refine and broaden its clinical value.',
          title:
            'Practice Parameters for the Use of Actigraphy in the Assessment of Sleep and Sleep Disorders: An Update for 2007'
        },

          */
        }
        console.log(run);

        console.log(
          run.child_runs.find((run) => run.name === "RunnableSequence")
            ?.serialized
        );
      },
    })
    .stream(
      {
        sessionId,
        chatHistory,
        question,
      },
      {
        configurable: { sessionId },
        callbacks: [
          {
            // handleChainError(){}
            // handleChainStart() {}
            // handleChatModelStart(
            //   llm,
            //   messages,
            //   runId,
            //   parentRunId,
            //   extraParams,
            //   tags,
            //   metadata,
            //   name
            // ) {
            //   console.log(llm);
            //   console.log(messages);
            //   console.log(runId);
            //   console.log(parentRunId);
            //   console.log(extraParams);
            //   console.log(tags);
            //   console.log(metadata);
            //   console.log(name);
            // },
            handleChainEnd(_outputs, _runid, parentRunId, tags, kwargs) {
              const test = _outputs?.test;

              if (test) {
                console.log(test.query);
              }
              console.log(test);
              console.log(_outputs);
              console.log(_runid);
              console.log(parentRunId);
              console.log(tags);
              console.log(kwargs);

              if (tags?.includes("map:key:papers")) {
                console.log(_outputs);
              }

              if (parentRunId == null) {
                // TODO! Add correct function with query and papers
                // memory.addMessage(
                //   new FunctionMessage({ name: "test", content: "done" })
                // );
                // check that main chain (without parent) is finished:
                console.log(_outputs);
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
