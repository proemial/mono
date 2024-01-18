"use client";

import SearchInput from "@/app/(pages)/answer-engine/search-input";
import { useChat } from "ai/react";

const STARTERS = ["Do Vaccines Cause Autism Spectrum Disorder?"];
// const markdown = '[sdfsdfsdf]("/")';

const html = `<a href="/">test link</a>`;
export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
  } = useChat({
    api: "/api/bot/answer-engine",
  });

  const showStarters = messages.length === 0;

  return (
    <div className="relative flex flex-col w-full max-w-md py-24 mx-auto prose stretch">
      {/* <div>{`<a href="/">test link</a>`}</div> */}
      {messages.map((m) => (
        <div
          className="prose prose-invert"
          key={m.id}
          dangerouslySetInnerHTML={{ __html: m.content }}
        />
      ))}

      {isLoading ? <span> ... is loading </span> : null}

      {showStarters
        ? STARTERS.map((starter) => (
            <button
              onClick={() => {
                append({ role: "user", content: starter });
              }}
            >
              {starter}
            </button>
          ))
        : null}

      <SearchInput
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
