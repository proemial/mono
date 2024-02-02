"use client";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";

type Props = {
  id: string;
  date: string;
  organisation: string;
  children: string | ReactNode;
};

export function PaperCard({ date, children }: Props) {
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
        <div>{dayjs(date).format("M.D.YYYY")}</div>
      </div>

      <div className={`text-[24px] font-sans font-normal leading-[32px]`}>
        {children}
      </div>

      {/*<div className="text-[12px] mb-2 font-sans opacity-50 font-normal tracking-wide">*/}
      {/*  #data-science #ai #3dmodels*/}
      {/*</div>*/}
    </div>
  );
}
