"use client";

import { ArrowLeft } from "@/app/components/icons/arrows/arrow-left";
import { Copy } from "@/app/components/icons/functional/copy";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Toaster, toast } from 'sonner'


type Props = {
  id: string;
  date: string;
  organisation: string;
  children: string | ReactNode;
};

function copyToClip() {
  const el = document.createElement('input');
  el.value = window.location.href;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export function PaperCard({ date, children }: Props) {
  const router = useRouter();

  return (
    <div className="flex p-6 bg-[#1A1A1A] flex-col before:absolute before:-inset-0  relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 border-b shadow border-neutral-100/10 w-full">
      <div className="w-full mb-5 bg-transparent flex flex-row justify-between">
        <button
          className="flex text-[14px] flex-row gap-1 font-sans text-left items-center"
          type="button"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          <p>Back</p>
        </button>

        <button
          onClick={() => { copyToClip(); toast('Link copied to clipboard') }}>
          <Copy />
        </button>

      </div>

      <div className="mb-2 text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide">
        RESEARCH PAPER
        <span> — {dayjs(date).format("M.D.YYYY")}</span>
      </div>

      {/* ↓↓↓ We should pull tags here ↓↓↓

      <div className="text-[12px] mb-2 font-sans opacity-50 font-normal tracking-wide">
        #data-science #ai #3dmodels
      </div>

      */}

      <div className={`text-[24px] font-sans font-normal leading-[32px]`}>
        {children}
      </div>
    </div>
  );
}
