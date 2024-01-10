"use client";
import { useChat } from "ai/react";
import React, { useEffect } from "react";
import { BotForm } from "./form";
import { BotMessages } from "./messages";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Spinner } from "@/app/components/spinner";
import { useRef } from "react";

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
      <div className="flex flex-col">
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
        <div className="bg-black fixed bottom-0 max-w-screen-md mx-auto inset-x-0 z-50 py-4">
          <BotForm
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            inputFieldRef={inputFieldRef}
          />
        </div>
      </div>
    </>
  );
}
