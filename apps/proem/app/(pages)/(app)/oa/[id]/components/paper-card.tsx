"use client";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";
import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";

type Props = {
  id: string;
  paper: OpenAlexPaper;
  children: string | ReactNode;
};

export function PaperCard({ children, paper }: Props) {
  return (
    <div className="flex px-6 pb-6 bg-[#1A1A1A] flex-col before:absolute before:-inset-0 relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 border-b shadow border-[#4E4E4E] w-full">
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
        <div className="text-white/50 leading-4">
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

function Concepts({ data }: { data: OpenAlexWorkMetadata }) {
  const sorted = (data || []).concepts.sort((a, b) => a.level - b.level);
  const filtered = sorted ? [sorted.at(0), sorted.at(-2), sorted.at(-1)] : [];

  return (
    <div className="flex gap-1 text-xs text-white/50 mt-2 font-sans">
      {filtered && (
        <div
          key={filtered[0]?.id}
          className="border border-white/50 rounded-md px-1 whitespace-nowrap"
        >
          {filtered[0]?.display_name}
        </div>
      )}
      {filtered?.slice(1).map((c) => (
        <div
          key={c?.id}
          className="border border-white/50 rounded-md px-1 truncate"
        >
          {c?.display_name}
        </div>
      ))}
    </div>
  );
}
