import { Message as AiMessage, CreateMessage } from "ai";
import { Message, Question } from "./message";
import { Analytics } from "@/app/components/analytics";

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
    Analytics.track("click:question-explainer", { msg });
    appendQuestion(`What is ${msg}?`);
  };

  const handleSuggestionClick = (question: string) => {
    Analytics.track("click:question-suggestion", { question });
    appendQuestion(question);
  };

  return (
    <>
      {messages.length === 0 &&
        suggestions?.map((question, i) => (
          <Question
            key={i}
            onClick={() => handleSuggestionClick(question)}
            className="cursor-pointer"
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
    </>
  );
}
