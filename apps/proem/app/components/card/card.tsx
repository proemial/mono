import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";
import dayjs from "dayjs";
import { Spinner } from "@/app/components/spinner";
import Summary from "@/app/(pages)/oa/[id]/components/summary";
import { Suspense } from "react";
import assetImg1 from "@/app/images/asset-bg-1.png";
import assetImg2 from "@/app/images/asset-bg-2.png";
import assetImg3 from "@/app/images/asset-bg-3.png";
import Link from "next/link";

export async function PaperCard({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  const organisation =
    paper.data.primary_location?.source?.host_organization_name;
  const date = paper.data.publication_date;

  return (
    <div className="bg-[#2F2F2F] mb-3 rounded-sm border border-[#3C3C3C] scale-100 active:scale-[0.99] transition-all duration-100">
      <div className="p-4 flex flex-col justify-between text-lg font-medium items-left h-full">
        <div className="w-full flex">

          <div className="text-[12px] mb-3 leading-snug font-normal font-sans items-end uppercase tracking-wide">
            PUBLISHED ON {organisation} <span className="text-white/50"> — {dayjs(date).format("M.D.YYYY")}</span>
          </div>

          {/* ↓↓↓ We should pull tags here ↓↓↓

      <div className="text-[12px] mb-2 font-sans opacity-50 font-normal tracking-wide">
        #data-science #ai #3dmodels
      </div>
      
      */}

        </div>
        <div>
          <a href={`/oa/${id}`}>
            <div className="text-[20px] font-sans font-normal leading-[26px]">
              <Suspense fallback={<Spinner />}>
                <Summary paper={paper} />
              </Suspense>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return assetImg1.src;
  if (lastNum < 6) return assetImg2.src;
  return assetImg3.src;
}
