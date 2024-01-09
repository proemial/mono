import { Message as AiMessage, CreateMessage } from "ai";
import { Message, Question } from "./message";
import { Tracker } from "@/app//components/analytics/tracker";

type Props = {
  messages: AiMessage[];
  suggestions: string[];
  append: (
    message: AiMessage | CreateMessage,
  ) => Promise<string | null | undefined>;
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
    <div className="flex flex-col justify-end">
      {messages.length === 0 &&
        suggestions?.map((question, i) => (
          <Question
            key={i}
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
  );
}
