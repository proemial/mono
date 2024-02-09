"use client";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";
import { cn } from "@/app/components/shadcn-ui/utils";
import dayjs from "dayjs";
import { ReactNode } from "react";

type PaperCardSize = "default" | "lg";

export function PaperCardTop({
  date,
  size = "default",
}: {
  date: string;
  /**
   * size defaults to "default"
   */
  size?: PaperCardSize;
}) {
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

export function PaperCardTitle({
  children,
  size = "default",
}: {
  children: ReactNode;
  /**
   * size defaults to "default"
   */
  size?: PaperCardSize;
}) {
  return (
    <div
      className={cn(`font-normal`, {
        "text-[18px] text-base leading-6": size === "default",
        "text-[24px] leading-[32px]": size === "lg",
      })}
    >
      {children}
    </div>
  );
}

export function ClickFeedback({ children }: { children: ReactNode }) {
  return (
    <div className="scale-100 active:scale-[0.99] transition-all duration-100">
      {children}
    </div>
  );
}
export function PaperCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border border-t-0 border-x-0 border-[#4E4E4E]",
        className
      )}
    >
      <div className="flex flex-col justify-between h-full px-4 pt-2 pb-4 text-lg font-medium items-left">
        {children}
      </div>
    </div>
  );
}
