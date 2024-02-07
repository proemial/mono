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
      <div className="fixed w-full top-0 z-50 bg-black shadow-bottom">
        <div className="flex flex-row items-center justify-between max-w-screen-md px-6 pt-3 pb-2 mx-auto">
          <Link href="/" onClick={handleClick}>
            <div className="flex flex-row gap-3">
              <Proem />
              <span className="text-[16px] font-sans font-normal">{title}</span>
            </div>
          </Link>
          {action}
        </div>
      </div>
    </>
  );
}
