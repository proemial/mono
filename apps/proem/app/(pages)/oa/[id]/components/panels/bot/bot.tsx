"use client";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useChat } from "ai/react";
import React from "react";
import { BotForm } from "./form";
import { BotMessages } from "./messages";

type Props = {
  paper: OpenAlexPaper;
  suggestions: string[];
};

export function InsightsBot({ paper, suggestions }: Props) {
  const { title, abstract } = paper.data;

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: { title, abstract, model: "gpt-3.5-turbo" },
    api: "/api/bot/chat",
  });

  const inputFieldRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (messages?.length > 0 && inputFieldRef.current) {
      inputFieldRef.current.scrollIntoView(false);
    }
  }, [messages]);

  return (
    <>
      {!suggestions && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      {suggestions && (
        <BotMessages
          messages={messages}
          suggestions={suggestions}
          append={append}
        />
      )}

      <div className="inset-x-0 bottom-0 z-50 max-w-screen-md py-4 mx-auto bg-yellow-100">
        <BotForm
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          inputFieldRef={inputFieldRef}
        />
      </div>
    </>
  );
}
