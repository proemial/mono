import assetImg1 from "@/app/images/asset-bg-1.png";
import assetImg2 from "@/app/images/asset-bg-2.png";
import assetImg3 from "@/app/images/asset-bg-3.png";
import dayjs from "dayjs";
import { ReactNode } from "react";

type Props = {
  id: string;
  date: string;
  organisation: string;
  children: string | ReactNode;
};

export function PaperCard({ id, date, organisation, children }: Props) {
  return (
    <div
      className={`min-h-[228px] px-4 pb-4 pt-16 flex flex-col justify-end items-begin`}
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
        boxShadow: "inset 0 -40px 60px -10px #000000",
      }}
    >
      <div className="mb-2 text-sm text-primary-light text-shadow-purple">
        {organisation} - {dayjs(date).format("MMM DD, YYYY")}
      </div>
      <div className={`text-3xl text-shadow-shine`}>{children}</div>
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return assetImg1.src;
  if (lastNum < 6) return assetImg2.src;
  return assetImg3.src;
}
