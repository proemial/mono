import { Trackable } from "@/components/trackable";
import { Avatar } from "../../../components/avatars";
import logo from "../../../components/images/logo.svg";
import Image from "next/image";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Throbber } from "@/components/throbber";
import { BotSuggestion } from "./bot-suggestion";
import { useEffect, useRef } from "react";
import { useIsApp } from "@/utils/app";

const showFollowups = false;

const references = [
	// {
	// 	title: "Evaluating the impact of U.S. protectionist trade policies",
	// 	date: "2024-09-23",
	// 	journal: "Journal of Infrastructure Policy and Development",
	// 	author: "Dr. Sarah Chen",
	// 	university: "Stanford University",
	// },
	// {
	// 	title: "Current World-System and Conflicts",
	// 	date: "2024-08-30",
	// 	journal: "Journal of World-Systems Research",
	// 	author: "Dr. Michael Rodriguez",
	// 	university: "London School of Economics",
	// },
	// {
	// 	title:
	// 		"Impact of Trade Wars on the Global Economy and on the Macroeconomic an...",
	// 	date: "2024-10-31",
	// 	journal: "Economic Policy",
	// 	author: "Dr. James Wilson",
	// 	university: "Harvard University",
	// },
	// {
	// 	title: "Global Supply Chain Disruptions in Modern Trade",
	// 	date: "2024-11-15",
	// 	journal: "International Journal of Economics",
	// 	author: "Dr. Emily Zhang",
	// 	university: "MIT",
	// },
	{
		title: "Emerging Markets Response to Trade Tensions",
		date: "2024-10-05",
		journal: "Development Economics Review",
		author: "Dr. Robert Kumar",
		university: "Oxford University",
	},
	{
		title: "Digital Trade and Cross-Border Data Flows",
		date: "2024-09-15",
		journal: "Technology Policy Review",
		author: "Dr. Lisa Anderson",
		university: "UC Berkeley",
	},
];

export function BotQa({
	question,
	answer,
	followups,
	user,
	scrollTo,
}: {
	question: string;
	answer?: string;
	followups?: string[];
	user?: {
		avatar: string;
		name: string;
		backgroundColor: string;
	};
	scrollTo?: boolean;
}) {
	const isApp = useIsApp();
	const qaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && scrollTo && qaRef.current) {
			const yOffset = isApp ? -82 : -64;
			const y =
				qaRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	}, [scrollTo, isApp]);

	return (
		<div ref={qaRef} className="flex flex-col mx-3">
			<div className=" bg-gradient-to-b to-[#e9ecec] from-[#e1e7ea] rounded-xl">
				<div className="flex flex-col flex-1">
					<div className="flex flex-col gap-2 p-3 w-full ">
						<div className="flex items-start w-full ">
							{user?.avatar ? (
								<div className="w-6 h-6 rounded-sm text-2xl flex items-center justify-center bg-[#0A161C]">
									<span className="text-[11px]">{user?.avatar ?? "*"}</span>
								</div>
							) : (
								<Avatar seed="6" />
							)}

							<div className="text-[#606567] text-sm leading-[14px] h-6 flex items-center ml-2 mb-1">
								{user?.name ?? "You"} asked
							</div>
						</div>

						<div className="font-medium text-[#08080a] text-[19px] leading-6">
							{question}
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 w-full ">
					<div className="flex gap-2">
						<div className="flex flex-col gap-1 flex-1 w-full overflow-hidden">
							<div className="flex flex-col gap-1 p-3 w-full">
								{answer ? (
									<>
										<div className="font-medium text-[#131316] text-[16px] leading-6 ">
											{formatAnswerText(answer)}
										</div>
										<div className="flex items-start w-full mt-2 mb-2">
											<div className="relative flex-[0_0_auto] w-6 h-6 rounded-sm bg-[#0A161C] flex items-center justify-center">
												<Image className="w-3 h-3" alt="Frame" src={logo} />
											</div>
											<div className="text-[#606567] font-normal text-sm leading-[14px] h-6 flex items-center ml-2 w-full">
												<div className="flex-1">Answer by Proem</div>
												<a
													href="/"
													className=" text-[#99a1a3] hover:underline hover:text-[#5b6668]"
													title="Learn how our Science bot works"
												>
													How it works?
												</a>
											</div>
										</div>

										<div className="flex justify-start gap-2 overflow-x-auto">
											{references?.map((ref, index) => (
												<div
													key={index}
													className="flex flex-col p-2 bg-[#cfd5d8] shadow-sm rounded-md w-[30%] md:w-[20%] flex-shrink-0"
												>
													<div className="flex flex-row w-full justify-between mt-1 mb-4">
														<a
															href="#1"
															className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
															style={{
																padding: "1px 4px",
															}}
														>
															&nbsp;{index + 1}&nbsp;
														</a>
														<div className="text-[10px] text-[#4d595f]">
															{ref.date &&
																`${new Date(ref.date).toLocaleString("default", { month: "short" })} ${new Date(ref.date).getFullYear()}`}
														</div>
													</div>

													<div className="text-[11px] text-[#131316] line-clamp-2">
														{ref.title}
													</div>
													<div className="text-[10px] italic text-[#4d595f] mt-1 mb-1">
														<div className="line-clamp-2">{ref.university}</div>
													</div>
												</div>
											))}
										</div>

										{/* <Trackable
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
									</Trackable> */}
									</>
								) : (
									<Throbber className="h-10 pb-0 sm:pb-3" />
								)}
							</div>
						</div>
					</div>
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
		</div>
	);
}

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
								className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
								style={{
									padding: "2px 5px",
									marginRight: "2px",
									position: "relative",
									top: "-2px",
								}}
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
