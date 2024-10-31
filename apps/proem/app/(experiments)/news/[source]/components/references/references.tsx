import { ReferencedPaper } from "@proemial/adapters/redis/news2";
import { Paper } from "./paper";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

export function References({
	papers,
	url,
}: { papers?: ReferencedPaper[]; url: string }) {
	return (
		<div
			id="sources"
			className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
		>
			<div className="flex flex-col items-start justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto]">
				<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#0a161c] text-lg tracking-[0] leading-5">
					Sources
				</div>
			</div>

			<div className="flex flex-col items-start gap-2 px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
				{papers?.map((paper, index) => (
					<Trackable
						key={index}
						trackingKey={
							analyticsKeys.experiments.news.item.sources.clickPaperSource
						}
						properties={{
							sourceUrl: url,
							paperId: paper.id,
						}}
					>
						<a
							href={`/paper/oa/${paper.id.split("/").at(-1)}`}
							className="flex items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl"
						>
							<div className="flex w-6 h-6 items-center justify-center gap-1 relative bg-[#08080a] rounded-3xl">
								<div className="relative flex-1 font-black text-[#f6f5e8] text-xs text-center tracking-[0] leading-[normal]">
									{index + 1}
								</div>
							</div>

							<Paper paper={paper} />
						</a>
					</Trackable>
				))}
			</div>
		</div>
	);
}
