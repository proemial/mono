"use client";

import SearchInput from "@/app/(pages)/answer-engine/search-input";
import { applyLinks } from "@/app/(pages)/oa/[id]/components/panels/bot/apply-links";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { Button } from "@/app/components/shadcn-ui/button";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const STARTERS = [
  "Do Vaccines Cause Autism Spectrum Disorder?",
  "Is a Daily Glass of Wine Healthy?",
  "Do Cell Phones Cause Brain Cancer?",
  "What is the universe made of?",
  "How can I lower my blood pressure?",
  "What can I do for heartburn relief?",
  "Is Microwaved Food Unsafe?",
  "Why do we dream?",
];
const PROEM_BOT = {
  name: "proem",
  initials: "P",
  avatar: "/android-chrome-512x512.png",
};

type MessageProps = {
  message: string;
  user?: {
    name: string;
    initials: string;
    avatar?: string;
  };
};

function Message({
  message,
  user = { name: "you", initials: "U", avatar: "" },
}: MessageProps) {
  const router = useRouter();
  const onClickHandle = router.push;
  const content = applyLinks(message, onClickHandle);
  return (
    <div className="w-full">
      <div className="flex gap-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-gray-600">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div>{user.name}</div>
      </div>

      <div className="flex-1 prose ml-9 prose-invert">{content}</div>
    </div>
  );
}

type ChatProps = Pick<MessageProps, "user">;

export default function Chat({ user }: ChatProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
  } = useChat({
    id: "quickfix_for_local_persistenst",
    api: "/api/bot/answer-engine",
  });

  const chatWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages?.length > 0 && chatWrapperRef.current) {
      chatWrapperRef.current.scrollIntoView(false);
    }
  }, [messages]);

  const isEmptyScreen = messages.length === 0;
  const showLoadingState = isLoading && messages.length <= 1;

  return (
    // TODO: Remove font-sans to use the global font
    <div
      className="relative flex flex-col min-h-full px-4 sm:px-0 pt-6 pb-12 mx-auto font-sans max-w-screen-sm"
      ref={chatWrapperRef}
    >
      {isEmptyScreen ? (
        <div className="flex flex-col mt-auto mb-5">
          <div className="flex flex-wrap gap-[6px] ">
            {STARTERS.map((starter) => (
              <Button
                key={starter}
                variant="ae_starter"
                size="sm"
                onClick={() => {
                  append({ role: "user", content: starter });
                }}
              >
                {starter}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full pb-20 space-y-5">
          {messages.map((m) => (
            <Message
              key={m.id}
              message={m.content}
              user={m.role === "assistant" ? PROEM_BOT : user}
            />
          ))}

          {showLoadingState ? (
            <Message
              message="Searching for relevant scientific papers..."
              user={PROEM_BOT}
            />
          ) : null}
        </div>
      )}

      <div className="fixed left-0 w-full bg-black bottom-14">
        <div className="w-full max-w-screen-md px-4 py-3 mx-auto">
          <SearchInput
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
