import { answers } from "@/app/api/bot/answer-engine/answers";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Run } from "@langchain/core/tracers/base";
import {
  StreamingTextResponse,
  createStreamDataTransformer,
  experimental_StreamData,
} from "ai";
import { PapersRequest } from "@/app/llm/chains/fetch-papers/fetch-papers-chain";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";

type ChatHistoryMessage = { role: string; content: string };

type AnswerEngineParams = {
  question: string;
  chatHistory: ChatHistoryMessage[];
  existingSlug?: string;
  userId?: string;
};

export async function askAnswerEngine({
  existingSlug,
  question,
  chatHistory,
  userId,
}: AnswerEngineParams) {
  const data = new experimental_StreamData();
  const isFollowUpQuestion = Boolean(existingSlug);
  const slug = existingSlug ?? prettySlug(question);
  const existingAnswers = isFollowUpQuestion
    ? await answers.getBySlug(slug)
    : [];

  const existingPapers = existingAnswers[0]?.papers?.papers;

  data.append({
    slug,
  });

  const stream = await answerEngineChain
    .withListeners({
      onEnd: saveAnswer(question, isFollowUpQuestion, slug, userId, data),
    })
    .stream({
      question,
      chatHistory: chatHistory.map(toLangChainChatHistory),
      papers: existingPapers,
    });

  return new StreamingTextResponse(
    stream.pipeThrough(createStreamDataTransformer(true)),
    {},
    data,
  );
}

const toLangChainChatHistory = (message: ChatHistoryMessage) =>
  message.role === "user"
    ? new HumanMessage(message.content)
    : new AIMessage(message.content);

const saveAnswer =
  (
    question: string,
    isFollowUpQuestion: boolean,
    slug: string,
    userId: string | undefined,
    data: experimental_StreamData,
  ) =>
  async (run: Run) => {
    const chainRun = run.child_runs as any as {
      inputs: {
        content: string;
        papersRequest: PapersRequest;
      };
    }[];

    const answer = chainRun.find((run) => run.inputs.content)?.inputs.content!;
    const paperRequest = chainRun.find((run) => run.inputs.papersRequest)
      ?.inputs.papersRequest!;

    const papers = isFollowUpQuestion
      ? {}
      : {
          relatedConcepts: paperRequest?.searchParams.relatedConcepts,
          keyConcept: paperRequest?.searchParams.keyConcept,
          papers: {
            papers: paperRequest?.papers,
          },
        };

    const insertedAnswer = await answers.create({
      slug,
      question,
      answer,
      ownerId: userId,
      ...papers,
    });

    if (!insertedAnswer) {
      data.close();
      return;
    }

    data.append({
      answers: {
        shareId: insertedAnswer.shareId,
        answer: insertedAnswer.answer,
      },
    });
    data.close();
  };
