import arrow from "./arrow.svg";
import Image from "next/image";

export function BotSuggestion({
	qa,
}: {
	qa: [string, string];
}) {
	return (
		<div className="gap-3 px-3 py-2 self-stretch w-full flex-[0_0_auto] border border-solid bg-[#E9EAEE]  flex items-center justify-center relative rounded-xl">
			<p className="relative flex-1 mt-[-1.00px] font-normal text-[#08080a] text-[15px] tracking-[0] leading-5">
				{qa.at(0)}
			</p>

			<Image
				className="relative w-[13px] h-[13px] mr-[-0.50px]"
				alt="Vector"
				src={arrow}
			/>
		</div>
	);
}
