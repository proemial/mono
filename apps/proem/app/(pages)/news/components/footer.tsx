export function Footer() {
	return (
		<div className="flex flex-col items-start justify-center gap-2 p-4 pt-5 pb-[88px] relative self-stretch w-full flex-[0_0_auto] bg-[#000000] rounded-[18px] max-[475px]:rounded-[18px_18px_0px_0px] min-[477px]:rounded-[18px_18px_0px_0px]">
			<div className="relative w-fit mt-[-1.00px] font-semibold text-[#f6f5e8] text-lg tracking-[0] leading-4 whitespace-nowrap">
				About
			</div>

			<p className="relative self-stretch font-normal text-[#f6f5e8] text-sm tracking-[0] leading-5">
				Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.
			</p>
			<p className="relative self-stretch font-normal text-[#f6f5e8] text-sm tracking-[0] leading-5">
				We are a small European startup based in Aarhus, Denmark. Our mission is to make science useful and inspiring for everyone. 
			</p>
			<p className="relative self-stretch font-normal text-[#f6f5e8] text-sm tracking-[0] leading-5">
				Learn more at <a href="https://about.proem.ai" className="text-[#62f835] ">about.proem.ai</a>
			</p>
		</div>
	);
}
