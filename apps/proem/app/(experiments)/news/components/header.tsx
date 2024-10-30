import logo from "./images/logo.svg";
import Image from "next/image";

export function Header() {
	return (
		<div className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#000000]">
			<div className="items-center gap-2 flex-1 grow flex relative">
				<Image
					className="relative w-[10.51px] h-4"
					alt="Logotype green logo"
					src={logo}
				/>

				<div className="relative flex-1 font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
					proem
					<span className="text-[#93938f] pl-3 font-normal">
						trustworthy perspectives
					</span>
				</div>
			</div>
		</div>
	);
}
