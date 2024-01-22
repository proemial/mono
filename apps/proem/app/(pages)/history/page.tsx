import { PaperCard } from "@/app/components/card/card";
import { PageHeader } from "@/app/components/page-header";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/app/components/shadcn-ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import { Bookmark } from "@/app/components/icons/functional/bookmark";
import { History } from "@/app/components/icons/functional/history";

export const revalidate = 1;

export default async function HistoryPage() {
  return (
    <div className="relative w-full">
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="text-[14px] sticky z-10 justify-start w-full bg-background top-14 h-[unset] pt-3 pb-3 px-4">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <div className="bg-[#2F2F2F] border border-[#3C3C3C] rounded m-auto mx-4 flex flex-col gap-3 px-4 py-4 leading-snug">
            <div className="flex h-36 bg-[#3C3C3C] rounded">
              <div className="m-auto scale-150">
                <History />
              </div>
            </div>
            <div className="flex flex-col justify-between items-left gap-3">
              <div className="flex flex-col text-left">
                <p className="text-white text-lg font-sans font-medium">
                  History
                </p>
                <p className="text-[#808080] text-sm font-sans font-normal">
                  All of your activity in one place
                </p>
              </div>
              <div className="bg-[#3C3C3C] h-10 min-w-lg flex rounded-3xl items-center">
                <p className="px-4 text-white text-sm m-auto text-center font-sans font-medium">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="bookmarks">
          <div className="bg-[#2F2F2F] border border-[#3C3C3C] rounded m-auto mx-4 flex flex-col gap-3 px-4 py-4 leading-snug">
            <div className="flex h-36 bg-[#3C3C3C] rounded">
              <div className="m-auto scale-150">
                <Bookmark />
              </div>
            </div>
            <div className="flex flex-col justify-between items-left gap-3">
              <div className="flex flex-col text-left">
                <p className="text-white text-lg font-sans font-medium">
                  Bookmarks
                </p>
                <p className="text-[#808080] text-sm font-sans font-normal">
                  All the things you want to keep close
                </p>
              </div>
              <div className="bg-[#3C3C3C] h-10 min-w-lg flex rounded-3xl items-center">
                <p className="px-4 text-white text-sm m-auto text-center font-sans font-medium">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}