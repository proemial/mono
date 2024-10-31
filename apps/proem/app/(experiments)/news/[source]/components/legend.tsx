import { NewsItem } from "@proemial/adapters/redis/news";

export function Legend({
	title,
	image,
	url,
	host,
}: {
	title?: string;
	image?: string;
	url?: string;
	host?: string;
}) {
	return (
		<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
			<img
				className="relative self-stretch w-full h-[220px] object-cover object-top"
				alt=""
				src={image}
			/>

			<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative self-stretch mt-[-1.00px] font-semibold text-white text-xl tracking-[0] leading-[normal]">
					{title}
				</p>
			</div>

			<div className="inline-flex items-start gap-1 px-3 py-1 absolute top-[176px] left-[12px] bg-[#ffffffe6] rounded-[26px]">
				<a href={url} target="_blank" rel="noopener noreferrer">
					{host}
				</a>
			</div>
		</div>
	);
}
