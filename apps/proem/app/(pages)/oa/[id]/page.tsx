import { QuestionsPanel } from "@/app/(pages)/oa/[id]/components/panels/questions";
import { Spinner } from "@/app/components/spinner";
import { Suspense } from "react";
import { PaperCard } from "./components/paper-card";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";
import * as metadata from "./page-metadata";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import Link from "next/link";
import { VerifiedStar } from "@/app/components/icons/other/star";
import { LinkButton } from "@/app/(pages)/oa/[id]/components/menu/link-button";
import { Button } from "@/app/components/shadcn-ui/button";
import { DocumentEmpty } from "@/app/components/icons/objects/document-empty";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams: { title?: string };
};

export async function generateMetadata({ params: p, searchParams: s }: Props) {
  const description = await metadata.getDescription(p.id, s.title);

  return metadata.formatMetadata(p.id, description);
}

export default async function ReaderPage({ params }: Props) {
  const paper = await fetchPaper(params.id);

  if (!paper) {
    notFound();
  }

  return (
    <div className="relative w-full h-full">
      <PaperCard
        id={params.id}
        date={paper.data.publication_date}
        organisation={
          paper.data.primary_location?.source?.host_organization_name
        }
      >
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCard>

      <Tabs defaultValue="QA" className="w-full">
        <TabsList className="text-[14px] sticky z-10 justify-start w-full bg-background top-14 h-[unset] pt-3 pb-3 px-4">
          <TabsTrigger value="QA">QA</TabsTrigger>
          <TabsTrigger value="publicquestions">Public Q&A</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        <TabsContent value="QA">
          <div className="flex flex-col h-full gap-6 px-6 py-3 text-base">
            <Suspense fallback={<Spinner />}>
              <QuestionsPanel paper={paper} />
            </Suspense>
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
          {/* TODO! For Rasmus: Render out a list of authors with this styling inside of
          the div with bg - (2F2F2F) */}

          <div className="flex flex-col gap-3 px-4 py-4 mb-2 leading-snug">
            <div className="flex flex-col items-center m-auto">
              <div className="bg-[#2F2F2F] border border-[#3C3C3C] rounded-full p-1">
                <DocumentEmpty />
              </div>
              <p className="text-white text-[18px] mb-1 mt-4 font-sans font-normal">
                No one has claimed this paper yet
              </p>
              <p className="text-white/50 text-[14px] font-sans font-light mb-4">
                Are you the auther of this paper?
              </p>
              <Button
                asChild
                className="text-xs font-sans font-medium text-black scale-100 active:scale-[0.99] transition-all duration-100"
              >
                <Link
                  href="https://tally.so/r/w2PLAL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claim this paper
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="metadata">
          <div className="bg-[#2F2F2F] max-w-xs flex flex-col leading-snug gap-3 mb-2 py-4 px-4 rounded-sm border border-[#3C3C3C] m-auto">
            <LinkButton url={paper.data.primary_location?.landing_page_url} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
