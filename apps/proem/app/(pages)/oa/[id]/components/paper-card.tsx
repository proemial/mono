"use client";

import assetImg1 from "@/app/images/asset-bg-1.png";
import assetImg2 from "@/app/images/asset-bg-2.png";
import assetImg3 from "@/app/images/asset-bg-3.png";
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
    <div className="flex p-6 bg-[#1A1A1A] flex-col">
      <div className="w-full mb-6 bg-transparent">
        <button
          className="flex flex-row gap-2 font-sans text-left"
          type="button"
          onClick={() => router.back()}
        >
          <svg
            className="fill-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H7.41421L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z" />
          </svg>
          <p>Back</p>
        </button>
      </div>

      <div className="mb-1 text-[12px] text-white font-sans font-normal uppercase tracking-wide">
        RESEARCH PAPER
        <span className="text-white/50">
          {" "}
          — {dayjs(date).format("M.D.YYYY")}
        </span>
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
