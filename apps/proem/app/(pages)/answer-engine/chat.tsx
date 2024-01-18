"use client";

import SearchInput from "@/app/(pages)/answer-engine/search-input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { useChat } from "ai/react";

const STARTERS = ["Do Vaccines Cause Autism Spectrum Disorder?"];
const PROEM_BOT = {
  name: "proem",
  avatar: "https://github.com/shadcn.png",
};

type MessageProps = {
  message: string;
  user?: {
    name: string;
    avatar: string;
  };
};

function Message({
  message,
  user = { name: "you", avatar: "https://github.com/shadcn.png" },
}: MessageProps) {
  return (
    <div className="w-full">
      <div className="flex gap-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{user.name}</div>
      </div>

      <div
        className="flex-1 prose ml-9 prose-invert"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}

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
  const showLoadingState = isLoading && messages.length <= 1;

  return (
    <div className="relative flex flex-col py-24">
      <div className="w-full space-y-5">
        {messages.map((m) => (
          <Message
            key={m.id}
            message={m.content}
            user={m.role === "assistant" ? PROEM_BOT : undefined}
          />
        ))}

        {showLoadingState ? (
          <Message
            message="Searching for relevant scientific papers..."
            user={PROEM_BOT}
          />
        ) : null}
      </div>

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
