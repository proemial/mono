"use client";
import { Concepts } from "@/app/components/card/concepts";
import {
  PaperCard,
  PaperCardTitle,
  PaperCardTop,
} from "@/app/components/card/paper-card";
import { usePaperState } from "@/app/components/login/state";
import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { ReactNode, useEffect } from "react";

type Props = {
  id: string;
  paper: OpenAlexPaper;
  children: ReactNode;
};

export function ReaderPaper({ children, paper, id }: Props) {
  const { setLatest } = usePaperState();

  useEffect(() => {
    setLatest(id);
  }, [id]);

  return (
    // <div className="flex px-6 pb-6 pt-2 bg-[#1A1A1A] flex-col before:absolute before:-inset-0 relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 border-b shadow border-[#4E4E4E] w-full">
    <PaperCard className="py-1">
      <PaperCardTop size="lg" date={paper.data.publication_date} />
      <PaperCardTitle size={"lg"}>{children}</PaperCardTitle>

      <div className="mt-1 mb-2 text-xs text-white/50">
        {paper.data.primary_location?.source?.host_organization_name}
      </div>

      <Concepts data={paper.data as OpenAlexWorkMetadata} />
    </PaperCard>
    // </div>
  );
}
