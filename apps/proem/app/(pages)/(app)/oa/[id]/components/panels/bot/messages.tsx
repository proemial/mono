import { Message as AiMessage } from "ai";
import { Message, Question } from "./message";
import { Tracker } from "@/app//components/analytics/tracker";
import { UseChatHelpers } from "ai/react";
import { MutableRefObject } from "react";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type Props = Pick<UseChatHelpers, "append"> & {
  messages: AiMessage[];
  starters: string[];
  chatWrapperRef: MutableRefObject<HTMLInputElement | null>;
};

export function BotMessages({
  messages,
  starters,
  append,
  chatWrapperRef,
}: Props) {
  const appendQuestion = (question: string) =>
    append({ role: "user", content: question });

  const explainConcept = (msg: string) => {
    Tracker.track(analyticsKeys.read.click.explainer, { msg });
    appendQuestion(`What is ${msg}?`);
  };

  const handleSuggestionClick = (question: string) => {
    Tracker.track(analyticsKeys.read.click.starter, { question });
    appendQuestion(question);
  };

  return (
    <div
      className="flex flex-col justify-end pb-14 scroll-mb-14"
      ref={chatWrapperRef}
    >
      {messages.length === 0 &&
        // TODO! Filter out empty strings as a hack for now until the data consistensy is fixed
        starters?.filter(Boolean).map((question) => (
          <Question
            key={question}
            onClick={() => handleSuggestionClick(question)}
            className="cursor-pointer max-w-full sm:max-w-lg scale-100 active:scale-[0.99] transition-all duration-100"
            starter
          >
            {question}
          </Question>
        ))}
      {messages?.map((message, i) => (
        <Message
          key={i}
          role={message.role}
          content={message.content}
          explain={explainConcept}
        />
      ))}

      {/* Will scroll user to bottom after scroll up */}
      {/* <ScrollToBottom /> */}
    </div>
  );
}
