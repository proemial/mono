import logo from "./images/logo.svg";
import Image from "next/image";
import { PlusCircle } from "@untitled-ui/icons-react";

export function Header() {
	return (
		<div className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-black">
			<div className="items-center gap-2 flex-1 grow flex relative">
				<Image
					className="relative w-[10.51px] h-4"
					alt="Logotype green logo"
					src={logo}
				/>

				<div className="relative flex-1 font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
					proem
					<span className="text-[#93938f] pl-2 font-normal text-sm">
						trustworthy perspectives
					</span>
				</div>
				<a
					href="/news/annotate"
					className=" text-[#f6f5e8] text-sm font-semibold hover:underline"
				>
					<PlusCircle className="size-6" />
				</a>
			</div>
		</div>
	);
}
