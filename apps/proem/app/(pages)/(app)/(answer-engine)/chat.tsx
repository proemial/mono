"use client";
import SearchInput from "@/app/(pages)/(app)/(answer-engine)/search-input";
import { applyLinks } from "@/app/(pages)/(app)/oa/[id]/components/panels/bot/apply-links";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { Dispatch, memo, useEffect, useRef, useState } from "react";
import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import WithHeader from "@/app/(pages)/(app)/header";
import { ClearIcon } from "@/app/components/icons/menu/clear-icon";
import { SquareIcon } from "lucide-react";
import { Button } from "@/app/components/proem-ui/link-button";
import { ProemLogo } from "@/app/components/icons/logo";
import { Tracker } from "@/app/components/analytics/tracker";

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

export default function Chat({ user, message }: MessageProps) {
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

  const actionButton = (
    <ActionButton
      isLoading={isLoading}
      messages={messages}
      setMessages={setMessages}
      stop={stop}
      setInput={setInput}
    />
  );

  return (
    <WithHeader title="science answers" action={actionButton}>
      {/*// TODO: Remove font-sans to use the global font*/}
      <div
        className="relative flex flex-col h-full px-4 pt-6 pb-12 font-sans"
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

        <div className="fixed left-0 w-full bg-black bottom-14">
          <div className="w-full max-w-screen-md px-4 py-3 mx-auto">
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
  setMessages: any;
  stop: any;
  setInput: Dispatch<React.SetStateAction<string>>;
};
function ActionButton(props: ActionButtonProps) {
  const { isLoading, messages, setMessages, stop, setInput } = props;
  const visible = !isLoading && messages.length > 0;
  const trackAndInvoke = (item: string, callback: () => void) => {
    Tracker.track(`click:ask-${item}`);
    callback();
  };

  return (
    <>
      <div
        onClick={() => trackAndInvoke("stop", () => stop())}
        className={`${
          // TODO: Fix fade in/out
          isLoading ? "opacity-100" : "opacity-0 hidden"
        } transition-all ease-in delay-300 duration-500 cursor-pointer`}
      >
        <SquareIcon size={22} />
      </div>

      <div
        onClick={() =>
          trackAndInvoke("clear", () => {
            setMessages([]);
            setInput("");
          })
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
    Tracker.track(`click:ask-starter`);
    callback();
  };

  return (
    <div className="flex flex-col h-full mb-5" suppressHydrationWarning>
      <div className="h-full flex flex-col text-center items-center justify-center px-8 font-sans">
        <Text />
      </div>
      <div className="flex flex-wrap gap-[6px] ">
        {starters.map((starter) => (
          <Button
            key={starter.index}
            variant="starter"
            className="mb-1 w-full cursor-pointer"
            onClick={() => {
              trackAndInvoke(() =>
                append({ role: "user", content: starter.text }),
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
      <ProemLogo />
      <div className="text-3xl py-4">proem</div>
      <div className="text-md text-white/80">
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
