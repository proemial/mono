import { ReferencedPaper } from "@proemial/adapters/redis/news";

export function Paper({ paper }: { paper?: ReferencedPaper }) {
	const source =
		paper?.primary_location?.source?.display_name ||
		paper?.primary_location?.source?.host_organization_name;

	return (
		<div className="flex flex-col items-start gap-[3px] relative flex-1 grow">
			<p className="relative self-stretch mt-[-1.00px] font-medium text-[#08080a] text-xs tracking-[0] leading-[normal] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
				{paper?.title}
			</p>

			<p className="relative self-stretch font-normal text-[#757989] text-xs tracking-[0] leading-[normal]">
				{source} ({paper?.published})
			</p>
		</div>
	);
}
