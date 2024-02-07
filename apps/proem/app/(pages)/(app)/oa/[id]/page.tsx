import { QuestionsPanel } from "@/app/(pages)/(app)/oa/[id]/components/panels/questions";
import { Spinner } from "@/app/components/spinner";
import { Suspense } from "react";
import { PaperCard } from "./components/paper-card";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import { notFound } from "next/navigation";
import { Metadata } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata";
import { Trackable } from "@/app/components/trackable";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type Props = {
  params: { id: string };
  searchParams: { title?: string };
};

export default async function ReaderPage({ params }: Props) {
  const paper = await fetchPaper(params.id);

  if (!paper) {
    notFound();
  }

  return (
    <div className="relative w-full pb-32">
      <PaperCard id={params.id} paper={paper}>
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCard>

      <Tabs defaultValue="QA" className="w-full">
        <TabsList className="text-[14px] sticky z-10 justify-start w-full bg-background top-14 h-[unset] pt-3 pb-3 px-4">
          <TabsTrigger value="QA">
            <Trackable track={analyticsKeys.read.click.answers}>
              Your answers
            </Trackable>
          </TabsTrigger>
          <TabsTrigger value="metadata">
            <Trackable track={analyticsKeys.read.click.metadata}>
              Metadata
            </Trackable>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="QA">
          <div className="flex flex-col h-full gap-6 px-6 text-base">
            <Suspense fallback={<Spinner />}>
              <QuestionsPanel paper={paper} />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="metadata">
          <div className="flex flex-col mb-2 px-4 mb-2">
            <Metadata paper={paper} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
