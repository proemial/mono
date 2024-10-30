import { NewsItem } from "@proemial/adapters/redis/news";

export function Legend({ data }: { data?: NewsItem }) {
	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<img
				className="relative self-stretch w-full h-[200px] object-cover"
				alt=""
				src={data?.source?.image}
			/>

			<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative self-stretch mt-[-1.00px] [font-family:'Lato-SemiBold',Helvetica] font-semibold text-white text-xl tracking-[0] leading-[normal]">
					{data?.generated?.title}
				</p>
			</div>

			<div className="inline-flex items-start gap-1 px-3 py-1 absolute top-[152px] left-[286px] bg-[#ffffffe6] rounded-[26px]">
				<img
					className="relative w-6 h-6 object-cover"
					alt=""
					src={data?.source?.logo}
				/>
				{data?.source?.name}
			</div>
		</div>
	);
}
