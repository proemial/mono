import { Trackable } from "@/components/trackable";
import { Avatar } from "../../../components/avatars";
import logo from "../../../components/images/logo.svg";
import Image from "next/image";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Throbber } from "@/components/throbber";

export function BotQa({
	user,
	qa,
	id,
}: {
	user?: {
		avatar: string;
		name: string;
		backgroundColor: string;
	};
	qa: [string, string];
	id: string;
}) {
	const formatAnswerText = (text?: string) => {
		if (!text) return "";
		return text
			.replace(/^\s*-\s*/gm, "")
			.split(/(\[.*?\])/)
			.map((segment, i) => {
				const match = segment.match(/\[(.*?)\]/);
				if (match) {
					const numbers = match[1]?.split(",").map((n) => n.trim());
					return numbers?.map((num, j) => (
						<span className="relative inline-block" key={`${i}-${j}`}>
							<a
								href={`#${num}`}
								key={`${i}-${j}`}
								onClick={() =>
									document
										.getElementById("sources")
										?.scrollIntoView({ behavior: "smooth" })
								}
								className="relative -top-[2px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-pointer hover:bg-gray-800"
							>
								{num}
							</a>
						</span>
					));
				}
				// Return regular text for non-link segments
				return segment;
			});
	};

	return (
		<div
			className="flex-col items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative"
			id={id}
		>
			<div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				{user?.avatar ? (
					<div className="relative w-10 h-10 object-cover rounded-full text-2xl flex items-center justify-center bg-[#000000]">
						<span>{user?.avatar ?? "*"}</span>
					</div>
			) : (
					<Avatar seed="6" />
				)}

				<div className="flex flex-col items-start gap-1 relative flex-1 grow">
					<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
						<div className="items-start gap-1 self-stretch flex-[0_0_auto] flex relative">
							<div className="relative flex-1 mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
								{user?.name ?? "You"}
							</div>
							<div className="px-[8px] py-[2px] ml-[2.00px] mt-[-2.00px] relative bg-[hsl(0,100%,100%)] rounded-xl shadow-sm border border-[hsl(0,0%,85%)]">
								<div className="relative w-fit mt-[-1.00px] font-semibold text-[#606060] text-[11px] tracking-[0] leading-[14px] whitespace-nowrap">
									Anonymous user
								</div>
							</div>
						</div>

						<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
							{qa.at(0)}
						</p>
					</div>
				</div>
			</div>

			<div className="flex-col items-start gap-2 pl-[58px] pr-3 py-0 self-stretch w-full flex-[0_0_auto] flex relative">
				<div className="items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
					<div className="mt-[4.00px] relative flex-[0_0_auto] w-6 h-6 rounded-full bg-black flex items-center justify-center">
						<Image className="w-3 h-3" alt="Frame" src={logo} />
					</div>

					<div className="flex flex-col items-start gap-1 relative flex-1 grow">
						<div className="flex-col gap-1 px-3 py-2 self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] flex items-center justify-center relative rounded-xl">
							<div className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative">
								<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
									proem.ai
								</div>

								<div className="px-[8px] py-[2px] ml-[2.00px] mt-[-2.00px] relative bg-[hsl(106,100%,60%)] rounded-xl shadow-sm border border-[hsl(106,100%,45%)]">
									<div className="relative w-fit mt-[-1.00px] font-semibold text-[hsl(106,100%,25%)] text-[11px] tracking-[0] leading-[14px] whitespace-nowrap">
										Science bot
									</div>
								</div>
							</div>

							{qa.at(1) ? (
								<>
									<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
										{formatAnswerText(qa[1])}
									</p>
									<Trackable
										trackingKey={
											analyticsKeys.experiments.news.item.qa
												.clickViewAllSources
										}
										properties={{ answer: qa.at(1) ?? "" }}
									>
									<div
										className="w-full font-medium text-[#757989] text-xs leading-5 cursor-pointer"
										onClick={() =>
											document
												.getElementById("sources")
												?.scrollIntoView({ behavior: "smooth" })
										}
									>
										Based on scientific papers ·{" "}
											<span className="underline">View sources</span>
									</div>
									</Trackable>
								</>
							) : (
								<Throbber className="h-10 pb-0 sm:pb-3" />
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-end gap-4 pr-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative w-fit mt-[-1.00px] font-normal text-[#65686d] text-[13px] tracking-[0] leading-[normal]">
					<span className="font-bold">Like</span>

					{/* {user && (
						<span className="font-medium">
							<span className="px-1">·</span> 42
						</span>
					)} */}
				</p>

				<div className="relative w-fit mt-[-1.00px] font-bold text-[#65686d] text-[13px] tracking-[0] leading-[normal]">
					Share
				</div>
			</div>
		</div>
	);
}
