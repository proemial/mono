export function FactualHeader() {
	return (
		<div className="flex items-center justify-end gap-2 px-3 py-0 relative self-stretch w-full">
			<div className="items-center gap-2 flex-1 grow flex relative">
				<div className="relative w-fit mt-[-1.00px] font-semibold text-[#0a161c] text-lg tracking-[0] leading-4 whitespace-nowrap">
					Find Answers in Research
				</div>
			</div>
		</div>
	);
}

export function BotHeader() {
	return (
		<div className="flex pl-[62px]">
			<p className="relative w-fit  font-medium text-[#757989] text-xs tracking-[0] leading-5 whitespace-nowrap">
				Suggested questions
			</p>
		</div>
	);
}
