import arrow from "./arrow.svg";

export function BotSuggestion({
	qa,
}: {
	qa: [string, string];
}) {
	return (
		<div className="gap-3 px-3 py-2 self-stretch w-full flex-[0_0_auto] bg-white border border-solid border-[#b2babe] flex items-center justify-center relative rounded-xl">
			<p className="relative flex-1 mt-[-1.00px] [font-family:'Lato-Regular',Helvetica] font-normal text-[#2d3d44] text-[15px] tracking-[0] leading-5">
				{qa.at(0)}
			</p>

			<img
				className="relative w-[13px] h-[13px] mr-[-0.50px]"
				alt="Vector"
				src={arrow}
			/>
		</div>
	);
}
