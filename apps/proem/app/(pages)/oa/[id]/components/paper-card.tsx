"use client";

import { ArrowLeft } from "@/app/components/icons/arrows/arrow-left";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  id: string;
  date: string;
  organisation: string;
  children: string | ReactNode;
};

export function PaperCard({ date, children }: Props) {
  const router = useRouter();

  return (
    <div className="flex p-4 bg-[#1A1A1A] flex-col before:absolute before:-inset-0 relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 w-full">
      <div className="mb-2 text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide">
        RESEARCH PAPER
        <span> — {dayjs(date).format("M.D.YYYY")}</span>
      </div>
      <div className={`text-[24px] font-sans font-normal leading-[32px]`}>
        {children}
      </div>
    </div>
  );
}
