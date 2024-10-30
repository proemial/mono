import { NewsItem } from "@proemial/adapters/redis/news";

export function Background({ data }: { data?: NewsItem }) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-SemiBold',Helvetica] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
				Factual Background
			</div>

			<p className="relative self-stretch [font-family:'Lato-Regular',Helvetica] font-normal text-[#08080a] text-sm tracking-[0] leading-5">
				{data?.generated?.background}
			</p>
		</div>
	);
}
