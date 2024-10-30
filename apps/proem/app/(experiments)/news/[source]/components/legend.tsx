import { NewsItem } from "@proemial/adapters/redis/news";

export function Legend({ data }: { data?: NewsItem }) {
	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<img
				className="relative self-stretch w-full h-[220px] object-cover object-top"
				alt=""
				src={data?.source?.image}
			/>

			<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative self-stretch mt-[-1.00px] font-semibold text-white text-xl tracking-[0] leading-[normal]">
					{data?.generated?.title}
				</p>
			</div>

			<div className="inline-flex items-start gap-1 px-3 py-1 absolute top-[176px] left-[12px] bg-[#ffffffe6] rounded-[26px]">
				<a href={data?.source?.url} target="_blank" rel="noopener noreferrer">
					{data?.source?.name}
				</a>
			</div>
		</div>
	);
}
