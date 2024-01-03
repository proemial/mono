import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";
import dayjs from "dayjs";
import { Spinner } from "@/app/components/spinner";
import Summary from "@/app/(pages)/oa/[id]/components/summary";
import { Suspense } from "react";
import assetImg1 from "@/app/images/asset-bg-1.png";
import assetImg2 from "@/app/images/asset-bg-2.png";
import assetImg3 from "@/app/images/asset-bg-3.png";

export async function PaperCard({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  const organisation =
    paper.data.primary_location?.source?.host_organization_name;
  const date = paper.data.publication_date;

  return (
    <div
      className="shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 pt-8 flex flex-col justify-end text-lg font-medium items-center ">
        <div className="w-full flex justify-between">
          <div className="flex items-end text-sm text-primary-light text-shadow-purple">
            {organisation} - {dayjs(date).format("MMM DD, YYYY")}
          </div>
          <div className="flex justify-end pb-4" />
        </div>
        <div>
          <a href={`/oa/${id}`} className="text-left text-2xl text-shadow-glow">
            <Suspense fallback={<Spinner />}>
              <Summary paper={paper} />
            </Suspense>
          </a>
        </div>
        <div className="w-full pt-6 pb-1 text-xs tracking-wider flex justify-begin gap-2 overflow-scroll no-scrollbar" />
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
