import checkmark from "./checkmark.svg";
import proem from "./logo.svg";
import Image from "next/image";

export default function WelcomePage() {
	return (
		<div className="flex flex-col min-h-[780px] items-start relative bg-black">
			<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-[#020d07]">
				<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-[#020d07]">
					<div className="flex items-center justify-start pt-6 pb-1 px-4 relative self-stretch w-full flex-[0_0_auto]">
						<Image
							className="relative w-9 h-9"
							alt="Proem"
							src={proem.src}
							width={36}
							height={36}
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-start gap-[16px_16px] p-4 relative self-stretch w-full flex-[0_0_auto]">
					<div className="flex flex-col min-w-[140px] min-h-[164px] items-start gap-3 p-4 relative flex-1 grow bg-[#b7e0ca1f] rounded-2xl overflow-hidden">
						<Image
							className="relative w-6 h-6"
							alt="Checkmark"
							src={checkmark.src}
							width={24}
							height={24}
						/>

						<div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
							<div className="relative self-stretch mt-[-1.00px] [font-family:'Outfit-SemiBold',Helvetica] font-semibold text-[#d7e4dd] text-[15px] tracking-[0] leading-[20.3px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
								Personal Summaries activated
							</div>

							<p className="relative self-stretch [font-family:'Outfit-Regular',Helvetica] font-normal text-[#d0ebdc9e] text-[15px] tracking-[0] leading-[20.3px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:7] [-webkit-box-orient:vertical]">
								Personal Summaries is now active and working seamlessly in Slack
								channels where @proem is added.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
