"use client";

import SearchInput from "@/app/(pages)/answer-engine/search-input";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/bot/answer-engine",
  });

  return (
    <div className="relative flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <SearchInput
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
