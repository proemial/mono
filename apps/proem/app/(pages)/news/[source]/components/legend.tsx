import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { extractHostName } from "@/utils/url";

export function Legend({
	title,
	image,
	url,
	summary,
}: {
	title?: string;
	image?: string;
	url: string;
	summary: string;
}) {
	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative w-full h-[220px] rounded-[14px] overflow-hidden border-black">
				<img
					alt=""
					src={image}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]" />
			</div>

			<div className="flex flex-col items-center justify-center gap-2 pt-3 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative self-stretch mt-[-4.00px] font-semibold text-xl tracking-[0] leading-[normal] drop-shadow-md">
					{title}
				</p>
				<p className="relative self-stretch text-sm tracking-[0] leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical]">
					{summary}
				</p>
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
