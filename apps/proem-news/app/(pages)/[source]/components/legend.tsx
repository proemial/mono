import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { extractHostName } from "@/utils/url";
import { useState } from "react";

export function Legend({
	url,
	title,
	image,
	summary,
}: {
	url: string;
	title?: string;
	image?: string;
	summary?: string;
}) {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative w-full h-[220px] rounded-[14px] overflow-hidden border-black">
				<img alt="" src={image} className="object-cover w-full h-full" />
				<div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]" />
			</div>

			<div className="flex flex-col items-center justify-center gap-2 pt-3 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative self-stretch mt-[-4.00px] font-semibold text-xl tracking-[0] leading-[normal]">
					{title}
				</p>
				<p
					className={`relative self-stretch text-sm tracking-[0] leading-5 overflow-hidden text-ellipsis transition-all duration-300 ease-in-out ${showMore ? "pb-5" : "line-clamp-4"}`}
				>
					{summary ?? ""}
				</p>

				<button
					type="button"
					onClick={() => setShowMore(!showMore)}
					className="z-20 text-[10px] leading-5 absolute right-0 bottom-[-4px] shadow-sm text-[#08080a] bg-white py-0.5 px-2 rounded-full before:content-[''] before:z-[-10] before:absolute before:left-[-31px] before:top-1/2 before:w-[30px] before:h-[20px] before:bg-gradient-to-r before:from-transparent before:to-[var(--newsBackground)] before:transform before:translate-y-[-50%]"
				>
					{showMore ? "Collapse" : "Full summary"}
				</button>
			</div>

			<div className="inline-flex items-start gap-1 px-3 py-1 absolute top-[176px] left-[12px] bg-[#ffffffe6] text-[#08080a] rounded-[26px]">
				<Trackable
					trackingKey={
						analyticsKeys.experiments.news.item.sources.clickPaperSource
					}
				>
					<a href={url} target="_blank" rel="noopener noreferrer">
						{extractHostName(url)}
					</a>
				</Trackable>
			</div>
		</div>
	);
}
