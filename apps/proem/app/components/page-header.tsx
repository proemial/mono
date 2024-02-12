"use client";
import { Proem } from "@/app/components/icons/brand/proem";
import Link from "next/link";
import { ReactNode } from "react";
import { Tracker } from "@/app/components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ProemLogo } from "@/app/components/logo";

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
      <div className="fixed top-0 z-50 w-full bg-black shadow-bottom">
        <div className="flex flex-row items-center justify-between max-w-screen-md px-6 pt-3 pb-2 mx-auto">
          <Link href="/" onClick={handleClick}>
            <div className="flex flex-row gap-3">
              <ProemLogo size="sm" />
              <span className="text-[16px] font-normal">{title}</span>
            </div>
          </Link>
          {action}
        </div>
      </div>
    </>
  );
}
