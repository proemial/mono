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

  const chatWrapperRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (messages?.length > 0 && chatWrapperRef.current) {
      chatWrapperRef.current.scrollIntoView(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
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
          chatWrapperRef={chatWrapperRef}
        />
      )}

      <div className="fixed left-0 w-full bg-black bottom-14">
        <div className="w-full max-w-screen-md px-4 py-3 mx-auto">
          <BotForm
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

    </div>
  );
}
