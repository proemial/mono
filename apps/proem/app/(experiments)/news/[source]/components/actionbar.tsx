import { NewsItem } from "@proemial/adapters/redis/news";
import eye from "../../components/images/eye.svg";
import share from "../../components/images/share.svg";
import Image from "next/image";

export function ActionBar() {
	return (
		<div className="flex items-center gap-2 pt-1 pb-0 px-3 relative self-stretch w-full flex-[0_0_auto]">
			<div className="flex items-center gap-2 pt-1 pb-0 px-3 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex items-center gap-3 relative flex-1 grow">
					<div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
						<Image className="relative w-6 h-6" alt="Frame" src={eye} />

						<div className="relative w-fit [font-family:'Lato-Regular',Helvetica] font-normal text-[#08080a] text-[13px] tracking-[0] leading-[normal]">
							101
						</div>
					</div>

					<div className="inline-flex items-center gap-1 px-3 py-2 relative flex-[0_0_auto] rounded-[19px] border border-solid border-[#d0d2da]">
						<div className="relative w-fit mt-[-1.00px] [font-family:'Lato-Regular',Helvetica] font-normal text-[#08080a] text-[13px] tracking-[0] leading-[normal]">
							Ask question
						</div>
					</div>
				</div>

				<div className="inline-flex h-8 items-center gap-1 px-3 py-2 relative flex-[0_0_auto] rounded-[19px] border border-solid border-[#d0d2d9]">
					<div className="inline-flex items-start gap-1.5 relative flex-[0_0_auto]">
						<Image
							className="relative w-3.5 h-[13px] mt-[-0.50px] ml-[-0.50px]"
							alt="Vector"
							src={share}
						/>

						<div className="relative w-fit mt-[-1.00px] [font-family:'Lato-Regular',Helvetica] font-normal text-[#08080a] text-[13px] tracking-[0] leading-[normal]">
							Share
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
