import { NewsItem } from "@proemial/adapters/redis/news";
import { Paper } from "./paper";

export function References({ data }: { data?: NewsItem }) {
	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<div className="flex flex-col items-start justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto]">
				<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#0a161c] text-base tracking-[0] leading-5">
					Sources
				</div>
			</div>

			<div className="flex flex-col items-start gap-2 px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
				{data?.references?.map((paper, index) => (
					<a
						href={`/paper/oa/${paper.id.split("/").at(-1)}`}
						key={index}
						className="flex items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl"
					>
						<div className="flex w-6 h-6 items-center justify-center gap-1 relative bg-[#08080a] rounded-3xl">
							<div className="relative flex-1 font-black text-[#f6f5e8] text-xs text-center tracking-[0] leading-[normal]">
								{index + 1}
							</div>
						</div>

						<Paper paper={paper} />
					</a>
				))}
			</div>
		</div>
	);
}
