import Summary from "@/app/(pages)/(app)/oa/[id]/components/summary";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { Spinner } from "@/app/components/spinner";
import dayjs from "dayjs";
import { Suspense } from "react";
import { Concepts } from "@/app/components/card/concepts";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";

export async function FeedPaper({
  id,
  mainConcept,
}: {
  id: string;
  mainConcept?: string;
}) {
  const paper = await fetchPaper(id);

  if (!paper) {
    return;
  }

  return (
    <div className="bg-[#1A1A1A] border border-t-0 border-x-0 border-[#4E4E4E] scale-100 active:scale-[0.99] transition-all duration-100">
      <div className="flex flex-col justify-between h-full px-4 pt-2 pb-4 text-lg font-medium items-left">
        <div className="flex w-full">
          <div className="w-full mb-2 flex justify-between text-[12px] text-white/50 font-sourceCodePro font-normal uppercase tracking-wide">
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
            <div>{dayjs(paper.data.publication_date).format("YYYY.MM.DD")}</div>
          </div>
        </div>

        <div>
          <div className="text-[18px] font-sans font-normal leading-6">
            <Suspense fallback={<Spinner />}>
              <Summary paper={paper} />
            </Suspense>
          </div>
        </div>
        <Concepts
          data={paper.data as OpenAlexWorkMetadata}
          mainConcept={mainConcept}
        />
      </div>
    </div>
  );
}
