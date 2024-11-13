import { Trackable } from "@/components/trackable";
import { Avatar } from "../../../components/avatars";
import logo from "../../../components/images/logo.svg";
import Image from "next/image";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Throbber } from "@/components/throbber";
import { BotSuggestion } from "./bot-suggestion";

const showFollowups = false;

export function BotQa({
	id,
	question,
	answer,
	followups,
	user,
}: {
	id: string;
	question: string;
	answer?: string;
	followups?: string[];
	user?: {
		avatar: string;
		name: string;
		backgroundColor: string;
	};
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
						<Trackable
							key={`${i}-${j}`}
							trackingKey={
								analyticsKeys.experiments.news.item.clickInlineReference
							}
						>
							<span className="relative inline-block">
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
						</Trackable>
					));
				}
				// Return regular text for non-link segments
				return segment;
			});
	};

	return (
		<div className="flex flex-col w-full gap-2" id={id}>
			<div className="flex items-start gap-1.5 px-3 w-full">
				{user?.avatar ? (
					<div className="w-10 h-10 rounded-full text-2xl flex items-center justify-center bg-black">
						<span>{user?.avatar ?? "*"}</span>
					</div>
				) : (
					<Avatar seed="6" />
				)}

				<div className="flex flex-col gap-1 flex-1">
					<div className="flex flex-col gap-1 p-3 w-full bg-[#e9eaee] rounded-xl">
						<div className="flex items-start gap-1 w-full">
							<div className="font-bold text-[#08080a] text-sm leading-[14px]">
								{user?.name ?? "You"}
							</div>
							<div className="px-1.5 py-0.5 ml-0.5 -mt-0.5 bg-white rounded-full border border-gray-300">
								<div className="font-semibold text-gray-500 text-xs leading-3">
									Anonymous user
								</div>
							</div>
						</div>

						<div className="font-medium text-[#08080a] text-[15px] leading-5">
							{question}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 pl-[58px] pr-3 w-full">
				<div className="flex gap-2 w-full">
					<div className="mt-1 w-6 h-6 rounded-full bg-black flex items-center justify-center">
						<Image className="w-3 h-3" alt="Frame" src={logo} />
					</div>

					<div className="flex flex-col gap-1 flex-1">
						<div className="flex flex-col gap-1 p-3 w-full bg-[#e9eaee] rounded-xl">
							<div className="flex items-start gap-1 w-full">
								<div className="font-bold text-[#08080a] text-sm leading-[14px]">
									proem.ai
								</div>

								<div className="px-1.5 py-0.5 ml-0.5 -mt-0.5 bg-black rounded-full">
									<div className="font-semibold text-[#6aba6f] text-xs leading-3">
										Science bot
									</div>
								</div>
							</div>

							{answer ? (
								<>
									<div className="font-medium text-[#08080a] text-[15px] leading-5">
										{formatAnswerText(answer)}
									</div>
									<Trackable
										trackingKey={
											analyticsKeys.experiments.news.item.qa.clickViewAllSources
										}
										properties={{ answer }}
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

			<div className="flex items-center justify-end gap-4 pr-6 w-full">
				<div className="font-normal text-[#65686d] text-[13px]">
					<Trackable
						trackingKey={analyticsKeys.experiments.news.item.clickAnswerLike}
					>
						<span className="font-bold">Like</span>
					</Trackable>
				</div>

				<Trackable
					trackingKey={analyticsKeys.experiments.news.item.clickAnswerShare}
				>
					<div className="font-bold text-[#65686d] text-[13px]">Share</div>
				</Trackable>
			</div>

			{showFollowups && (
				<div className="flex flex-col gap-2 pl-[58px] pr-3 w-full">
					<div>Followups: {followups?.length}</div>

					{followups?.map((followup, i) => (
						<BotSuggestion
							key={i}
							qa={[followup, ""]}
							isLoading={false}
							isAsked={false}
							handleSuggestionClick={() => {}}
						/>
					))}
				</div>
			)}
		</div>
	);
}
