import Summary from "@/app/(pages)/oa/[id]/components/summary";
import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";
import { Spinner } from "@/app/components/spinner";
import { onlyDeepLevelConcepts } from "@/app/utils/oa-utils";
import dayjs from "dayjs";
import Link from "next/link";
import { Suspense } from "react";

export async function PaperCard({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  if (!paper) {
    return undefined;
  }

  // const organisation =
  //   paper.data.primary_location?.source?.host_organization_name;
  const date = paper.data.publication_date;
  const concepts = onlyDeepLevelConcepts(paper.data.concepts);

  return (
    <div>
      <Link href={`/oa/${id}`}>
        <div className="bg-[#2F2F2F] mb-3 rounded-sm border border-[#3C3C3C] scale-100 active:scale-[0.99] transition-all duration-100">
          <div className="flex flex-col justify-between h-full p-4 text-lg font-medium items-left">
            <div className="flex w-full">
              <div className="mb-1 text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide">
                RESEARCH PAPER{" "}
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
            </div>
            <div>
              <div className="text-[20px] font-sans font-normal leading-[28px]">
                <Suspense fallback={<Spinner />}>
                  <Summary paper={paper} />
                </Suspense>
              </div>
              <div className="flex text-[12px] text-white/50 font-sourceCodePro uppercase tracking-wide">
                {concepts.map((concept) => concept.display_name).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
