"use client";
import { VerifiedStar } from "@/app/components/icons/other/star";
import { Button } from "@/app/components/shadcn-ui/button";
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
import Link from "next/link";
import React from "react";
import { BotForm } from "./form";
import { BotMessages } from "./messages";
import { LinkButton } from "@/app/(pages)/oa/[id]/components/menu/link-button";

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
          <TabsTrigger value="publicquestions">Public Q&A</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
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
        <TabsContent value="publicquestions">
          <div className="flex flex-col gap-3 px-4 py-4 mb-2 leading-snug">
            <div className="flex flex-col items-center m-auto">
              <VerifiedStar />
              <p className="text-white text-[18px] mb-1 mt-4 font-sans font-normal">
                There are no verified questions yet
              </p>
              <p className="text-white/50 text-[14px] font-sans font-light mb-4">
                Want to try out public Q&A?
              </p>
              <Button
                asChild
                className="font-sans text-xs font-medium text-black"
              >
                <Link
                  href="https://tally.so/r/wkE5lR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign up as a beta tester
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="authors">
          {/* <div className="bg-[#2F2F2F] flex flex-col leading-snug gap-3 mb-2 py-4 px-4 rounded-sm border border-[#3C3C3C] self-end">
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
          </div> */}

          {/* TODO! For Rasmus: Render out a list of authors with this styling inside of
          the div with bg - (2F2F2F) */}

          <div className="bg-[#2F2F2F] rounded-sm border border-[#3C3C3C] flex flex-col py-4 px-4 items-left m-auto">
            <p className="text-white text-[18px] font-sans font-normal">No one has claimed this paper yet</p>
            <p className="text-white/50 text-[14px] font-sans font-light mb-2">Are you the author of this paper?</p>
            <Button asChild className="text-xs font-sans font-medium text-black scale-100 active:scale-[0.99] transition-all duration-100"><Link href="https://tally.so/r/w2PLAL" target="_blank" rel="noopener noreferrer">Claim this paper</Link></Button>
          </div>

        </TabsContent>
        <TabsContent value="metadata">
          <div className="bg-[#2F2F2F] flex flex-col leading-snug gap-3 mb-2 py-4 px-4 rounded-sm border border-[#3C3C3C] self-end">

            {/* <LinkButton
              id={id}
              url={paper.data.primary_location?.landing_page_url}
            /> */}

          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}