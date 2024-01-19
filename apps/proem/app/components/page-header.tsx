"use client";
import { Proem } from "@/app/components/icons/brand/proem";
import Link from "next/link";

type PageHeaderProps = {
  title?: string;
};

export function PageHeader({ title = "Proem" }: PageHeaderProps) {
  return (
    <>
      <div className="sticky top-0 z-50 bg-[#1A1A1A]">
        <div className="flex flex-row items-center justify-between max-w-screen-md px-6 py-4 mx-auto">
          <Link href="/">
            <div className="flex flex-row gap-3">
              <Proem />
              <span className="text-[16px] font-sans font-normal">{title}</span>
            </div>
          </Link>
        </div>
      </div>
      <hr className="mx-6 h-[1px] border-t-0 bg-white/10" />
    </>
  );
}
