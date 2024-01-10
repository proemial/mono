"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useChat } from "ai/react";
import Image from "next/image";
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
      <Tabs defaultValue="QA" className="w-full">
        <TabsList>
          <TabsTrigger value="QA">QA</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>
        <TabsContent value="QA">
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

            <div className="fixed inset-x-0 bottom-0 z-50 max-w-screen-md px-6 py-4 mx-auto bg-black">
              <BotForm
                value={input}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                inputFieldRef={inputFieldRef}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="authors">
          <div className="bg-[#2F2F2F] flex flex-col leading-snug gap-3 mb-2 py-4 px-4 rounded-sm border border-[#3C3C3C] self-end">
            <div className="flex flex-row items-center gap-3">
              <Image
                src="/avatars/sara.png"
                alt="picture"
                width="38"
                height="38"
              />
              <div className="flex flex-col">
                <p className="text-white text-[16px] font-sans font-normal">
                  Sara Doyle
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3">
              <Image
                src="/avatars/sara.png"
                alt="picture"
                width="38"
                height="38"
              />
              <div className="flex flex-col">
                <p className="text-white text-[16px] font-sans font-normal">
                  Sara Doyle
                </p>
              </div>
            </div>
          </div>
          For Rasmus: Render out a list of authors with this styling inside of
          the box (2F2F2F)
        </TabsContent>
      </Tabs>
    </>
  );
}
