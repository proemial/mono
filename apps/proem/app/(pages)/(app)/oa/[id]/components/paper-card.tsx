"use client";
import dayjs from "dayjs";
import { ReactNode, useEffect } from "react";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";
import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { usePaperState } from "@/app/components/login/state";
import { Concepts } from "@/app/components/card/concepts";

type Props = {
  id: string;
  paper: OpenAlexPaper;
  children: string | ReactNode;
};

export function ReaderPaper({ children, paper, id }: Props) {
  const { setLatest } = usePaperState();

  useEffect(() => {
    setLatest(id);
  }, [id]);

  return (
    <div className="flex px-6 pb-6 pt-2 bg-[#1A1A1A] flex-col before:absolute before:-inset-0 relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 border-b shadow border-[#4E4E4E] w-full">
      <div className="mb-2 text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide flex justify-between">
        <div
          className="flex gap-2"
          style={{ fill: "#FFFFFF80", stroke: "#FFFFFF80", color: "#FFFFFF80" }}
        >
          <ReadIcon />
          JOURNAL ARTICLE
        </div>
        <div>{dayjs(paper.data.publication_date).format("YYYY.MM.DD")}</div>
      </div>

      <div className={`text-[24px] font-sans font-normal leading-[32px]`}>
        {children}
      </div>

      <div className="py-1 text-xs">
        <div className="leading-4 text-white/50">
          {paper.data.primary_location?.source?.host_organization_name}
        </div>
        <div className="leading-4">
          {paper.data.primary_location?.source?.display_name}
        </div>
      </div>

      <Concepts data={paper.data as OpenAlexWorkMetadata} />
    </div>
  );
}
