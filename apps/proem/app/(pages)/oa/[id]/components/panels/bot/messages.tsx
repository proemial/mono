import { Tracker } from "@/app//components/analytics/tracker";
import { Message as AiMessage } from "ai";
import { UseChatHelpers } from "ai/react";
import { Message, Question } from "./message";
import { MessageSquare } from "lucide-react";

type Props = Pick<UseChatHelpers, "append"> & {
  messages: AiMessage[];
  suggestions: string[];
};

export function BotMessages({ messages, suggestions, append }: Props) {
  const appendQuestion = (question: string) =>
    append({ role: "user", content: question });

  const explainConcept = (msg: string) => {
    Tracker.track("click:question-explainer", { msg });
    appendQuestion(`What is ${msg}?`);
  };

  const handleSuggestionClick = (question: string) => {
    Tracker.track("click:question-suggestion", { question });
    appendQuestion(question);
  };

  return (
    <div className="flex flex-col-reverse flex-grow overflow-y-scroll bg-red-200">
      <div className="snap-end">
        {messages.length === 0 &&
          // TODO! Filter out empty strings as a hack for now until the data consistensy is fixed
          suggestions?.filter(Boolean).map((question) => (
            <Question
              key={question}
              onClick={() => handleSuggestionClick(question)}
              className="cursor-pointer max-w-xl scale-100 active:scale-[0.99] transition-all duration-100"
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
      </div>
    </div>
  );
}
