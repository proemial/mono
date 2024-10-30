import { NewsItem } from "@proemial/adapters/redis/news";

export function Background({ data }: { data?: NewsItem }) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 px-3 pb-2 relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
				Factual Background
			</div>

			<p className="relative self-stretch font-normal text-[#0a161c] hover:underline hover:cursor-pointer text-sm tracking-[0] leading-5">
				{data?.generated?.background}
			</p>

			<div
				className="w-full font-medium text-[#757989] text-xs leading-5 cursor-pointer"
				onClick={() =>
					document
						.getElementById("sources")
						?.scrollIntoView({ behavior: "smooth" })
				}
			>
				Based on scientific papers ·{" "}
				<span className="underline">View sources</span>
			</div>
		</div>
	);
}
