"use client";

import SearchInput from "@/app/(pages)/(app)/(answer-engine)/search-input";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import WithHeader from "@/app/(pages)/(app)/header";
import { applyLinks } from "@/app/(pages)/(app)/oa/[id]/components/panels/bot/apply-links";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { ClearIcon } from "@/app/components/icons/menu/clear-icon";
import { ProemLogo } from "@/app/components/logo";
import { Button } from "@/app/components/proem-ui/link-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { useChat } from "ai/react";
import { memo, useEffect, useRef, useState } from "react";

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
  const { content } = applyLinks(message);

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
      <div className="bg-green-700"></div>
    </div>
  );
}

type ChatProps = Pick<MessageProps, "user" | "message">;

export default function Chat({ user, message }: ChatProps) {
  const [sessionSlug, setSessionSlug] = useState<null | string>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    setMessages,
    stop,
    setInput,
    data,
  } = useChat({
    id: "hardcoded",
    api: "/api/bot/answer-engine",
    body: { slug: sessionSlug },
  });

  const sessionSlugFromServer = (data as { slug?: string }[])?.find(
    ({ slug }) => slug
  )?.slug;

  useEffect(() => {
    if (sessionSlugFromServer) {
      setSessionSlug(sessionSlugFromServer);
      // TODO! Make some condition around new router replace after initial message is recieved
      // Router.replace(`/answer/${sessionIdFromServer}`);
    }
  }, [sessionSlugFromServer]);

  const chatWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages?.length > 0 && chatWrapperRef.current) {
      chatWrapperRef.current.scrollIntoView(false);
    }
  }, [messages]);

  useEffect(() => {
    if (message) {
      setMessages([]);
      if (message.length > 0) {
        append({ role: "user", content: message });
      }
    }
  }, [message]);

  const isEmptyScreen = messages.length === 0;
  const showLoadingState = isLoading && messages.length <= 1;
  const clear = () => {
    setMessages([]);
    setInput("");
    setSessionSlug(null);
  };

  const actionButton = (
    <ActionButton
      isLoading={isLoading}
      messages={messages}
      stop={stop}
      clear={clear}
    />
  );

  return (
    <WithHeader title="science answers" action={actionButton}>
      {/*// TODO: Remove font-sans to use the global font*/}
      <div
        className={`flex flex-col px-4 pt-6 pb-12 font-sans ${
          isEmptyScreen && "h-full"
        }`}
        ref={chatWrapperRef}
      >
        {isEmptyScreen ? (
          <Starters append={append} />
        ) : (
          <Messages
            messages={messages}
            showLoadingState={showLoadingState}
            user={user}
          />
        )}

        <div className="fixed left-0 w-full bg-black bottom-14 shadow-top">
          <div className="w-full max-w-screen-md px-4 pt-2 pb-3 mx-auto">
            <SearchInput
              handleSubmit={handleSubmit}
              input={input}
              handleInputChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </WithHeader>
  );
}

type ActionButtonProps = {
  isLoading: boolean;
  messages: any[];
  stop: any;
  clear: () => void;
};
function ActionButton(props: ActionButtonProps) {
  const { isLoading, messages, clear, stop } = props;
  const visible = !isLoading && messages.length > 0;
  const trackAndInvoke = (key: string, callback: () => void) => {
    Tracker.track(key);
    callback();
  };

  return (
    <>
      <div
        onClick={() =>
          trackAndInvoke(analyticsKeys.ask.click.stop, () => {
            stop();
            clear();
          })
        }
        className={`${
          // TODO: Fix fade in/out
          isLoading ? "opacity-100" : "opacity-0 hidden"
        } transition-all ease-in delay-300 duration-500 cursor-pointer`}
      >
        <ClearIcon />
      </div>

      <div
        onClick={() =>
          trackAndInvoke(analyticsKeys.ask.click.clear, () => clear())
        }
        className={`${
          // TODO: Fix fade in/out
          visible ? "opacity-100" : "opacity-0 hidden"
        } transition-all ease-in delay-300 duration-500 cursor-pointer`}
      >
        <ClearIcon />
      </div>
    </>
  );
}

const Starters = memo(function Starters({ append }: { append: any }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const starters = STARTERS.map((text, index) => ({ index, text }))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const trackAndInvoke = (callback: () => void) => {
    Tracker.track(analyticsKeys.ask.click.starter);
    callback();
  };

  return (
    <div className="flex flex-col h-full mb-3" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center h-full px-8 font-sans text-center">
        <Text />
      </div>
      <div className="flex flex-wrap gap-[6px] ">
        {starters.map((starter) => (
          <Button
            key={starter.index}
            variant="starter"
            className="w-full mb-1 cursor-pointer"
            onClick={() => {
              trackAndInvoke(() =>
                append({ role: "user", content: starter.text })
              );
            }}
          >
            {starter.text}
          </Button>
        ))}
      </div>
    </div>
  );
});

function Text() {
  return (
    <>
      <ProemLogo includeName />
      <div className="pt-6 text-md text-white/80">
        <div>answers to your questions</div>
        <div>supported by scientific research</div>
      </div>
    </>
  );
}

type MessagesProps = {
  messages: any[];
  showLoadingState: boolean;
  user: any;
};

function Messages({ messages, showLoadingState, user }: MessagesProps) {
  return (
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
  );
}
