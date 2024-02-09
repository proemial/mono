"use client";
import Summary from "@/app/(pages)/(app)/oa/[id]/components/summary";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { Spinner } from "@/app/components/spinner";
import dayjs from "dayjs";
import { ReactNode, Suspense } from "react";
import { Concepts } from "@/app/components/card/concepts";
import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";

export function PaperCardTop({ date }: { date: string }) {
  return (
    <div className="flex w-full">
      <div className="w-full flex justify-between text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide">
        <div
          className="flex items-center gap-2"
          style={{
            fill: "#FFFFFF80",
            stroke: "#FFFFFF80",
            color: "#FFFFFF80",
          }}
        >
          <ReadIcon />
          JOURNAL ARTICLE
        </div>
        <div>{dayjs(date).format("YYYY.MM.DD")}</div>
      </div>
    </div>
  );
}

export function PaperCardTitle({ children }: { children: ReactNode }) {
  return (
    // <div className="text-[18px] font-sans font-normal leading-6"></div>
    <div className={`text-[24px] font-sans font-normal leading-[32px`}>
      {children}
    </div>
  );
}

export function PaperCardSources({
  organisationName,
  displayName,
}: {
  organisationName?: string;
  displayName?: string;
}) {
  return (
    <div className="py-1 text-xs">
      <div className="leading-4 text-white/50">{organisationName}</div>
      <div className="leading-4">{displayName}</div>
    </div>
  );
}

export function LinkTransition({ children }: { children: ReactNode }) {
  return (
    <div className="scale-100 active:scale-[0.99] transition-all duration-100">
      {children}
    </div>
  );
}
export function PaperCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#1A1A1A] border border-t-0 border-x-0 border-[#4E4E4E] ">
      <div className="flex flex-col justify-between h-full px-4 pt-2 pb-4 text-lg font-medium items-left">
        {children}
      </div>
    </div>
  );
}
