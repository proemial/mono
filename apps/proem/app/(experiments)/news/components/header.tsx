import logo from "./images/logo.svg";
import Image from "next/image";
import { PlusCircle } from "@untitled-ui/icons-react";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

export function Header() {
	return (
		<div className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-black">
			<div className="items-center gap-2 flex-2 grow flex relative">
				<div className="font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
					<Trackable
						trackingKey={analyticsKeys.experiments.news.header.clickLogo}
					>
						<a href="/news/" className="flex items-center gap-2">
							<Image
								className="relative w-[10.51px] h-4"
								alt="Logotype green logo"
								src={logo}
							/>
							<div className="font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
								proem
							</div>
						</a>
					</Trackable>
				</div>
				<div className="relative flex-1 tracking-[0] leading-4 text-[#93938f] pl-2 font-normal text-sm">
					trustworthy perspectives
				</div>
			</div>
			<Trackable trackingKey={analyticsKeys.experiments.news.header.clickAdd}>
				<a
					href="/news/annotate"
					className="text-[#f6f5e8] text-sm font-semibold hover:underline"
				>
					<PlusCircle className="size-6 block hover:animate-[spin_1s_ease-in-out]" />
				</a>
			</Trackable>
		</div>
	);
}
