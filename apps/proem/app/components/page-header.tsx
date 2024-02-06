"use client";
import { Proem } from "@/app/components/icons/brand/proem";
import Link from "next/link";
import { ReactNode } from "react";
import { Tracker } from "@/app/components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type PageHeaderProps = {
  title?: string;
  action?: ReactNode;
};

export function PageHeader({
  title = "Proem",
  action = <></>,
}: PageHeaderProps) {
  const handleClick = () => {
    Tracker.track(analyticsKeys.ui.header.click.logo);
  };

  return (
    <>
      <div className="fixed w-full top-0 z-50 bg-[#1A1A1A]">
        <div className="flex flex-row items-center justify-between max-w-screen-md px-6 py-4 mx-auto">
          <Link href="/" onClick={handleClick}>
            <div className="flex flex-row gap-3">
              <Proem />
              <span className="text-[16px] font-sans font-normal">{title}</span>
            </div>
          </Link>
          {action}
        </div>
      </div>
      <hr className="mx-6 h-[1px] border-t-0 bg-white/10" />
    </>
  );
}
