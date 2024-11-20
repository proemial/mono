import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { Avatar, AvatarFallback } from "@proemial/shadcn-ui";
import logo from "../../components/images/logo.svg";
import Image from "next/image";

const references = [
	{
		title: "Evaluating the impact of U.S. protectionist trade policies",
		date: "2024-09-23",
		journal: "Journal of Infrastructure Policy and Development",
		author: "Dr. Sarah Chen",
		university: "Leland Stanford Junior University",
	},
	{
		title: "Current World-System and Conflicts",
		date: "2024-08-30",
		journal: "Journal of World-Systems Research",
		author: "Dr. Michael Rodriguez",
		university: "London School of Economics",
	},
	{
		title:
			"Impact of Trade Wars on the Global Economy and on the Macroeconomic an...",
		date: "2024-10-31",
		journal: "Economic Policy",
		author: "Dr. James Wilson",
		university: "Harvard University",
	},
	{
		title: "Global Supply Chain Disruptions in Modern Trade",
		date: "2024-11-15",
		journal: "International Journal of Economics",
		author: "Dr. Emily Zhang",
		university: "MIT",
	},
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

export function Background({ text, url }: { text?: string; url: string }) {
	const getLinkCount = (text?: string) => {
		if (!text) return 0;
		const matches = text.match(/\[(.*?)\]/g) || [];
		return matches.reduce((count, match) => {
			return count + match.split(",").length;
		}, 0);
	};
	const linkCount = getLinkCount(text);

	const formatBackground = (text?: string) => {
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
							<span className="">
								<a
									href={`#${num}`}
									key={`${i}-${j}`}
									onClick={() =>
										document
											.getElementById("sources")
											?.scrollIntoView({ behavior: "smooth" })
									}
									className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800 mb-4"
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

	return (
		<div className="flex flex-col">
			<div className=" bg-gradient-to-b to-[#e9ecec] from-[#e1e7ea] rounded-xl mb-0 mt-4">
				<div className="flex flex-col flex-1">
					<div className="flex flex-col gap-2 p-3 w-full">
						<div className="flex items-start w-full">
							<div className="flex justify-center items-center w-6 h-6 text-2xl bg-[#0A161C] rounded-sm">
								<span className="text-[11px]">👤</span>
							</div>

							<div className="text-[#606567] text-sm leading-[14px] h-6 flex items-center ml-2 mb-1">
								You asked
							</div>
						</div>

						<div className="font-medium text-[#08080a] text-[19px] leading-6">
							What is factual background?
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-2">
						<div className="flex overflow-hidden flex-col flex-1 gap-1 w-full">
							<div className="flex flex-col gap-1 px-3 pb-3 w-full">
								<>
									<div className="font-medium text-[#131316] text-[16px] leading-6">
										{formatBackground(text)}
									</div>
									<div className="flex items-start mt-2 mb-6 w-full">
										<div className="w-6 h-6 rounded-sm text-2xl flex items-center justify-center bg-[#0A161C]">
											<Image className="w-3 h-3" alt="Frame" src={logo} />
										</div>
										<div className="text-[#606567] font-normal text-sm leading-[14px] h-6 flex items-center ml-2 w-full gap-1">
											<div className="flex-1">Explained by Proem</div>

											<a
												href="/"
												onClick={(e) => e.preventDefault()}
												className="inline-flex items-center px-2 py-1 rounded-full border border-[#99a1a3] text-[#606567] hover:text-white hover:bg-[#99a1a3] transition-colors"
												title="Learn how our Science bot works"
											>
												<svg
													className="mr-1 w-3 h-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
												</svg>
												<div className="text-[11px]">Like</div>
											</a>
											<a
												href="/"
												onClick={(e) => e.preventDefault()}
												className="inline-flex items-center px-2 py-1 rounded-full border border-[#99a1a3] text-[#606567] hover:text-white hover:bg-[#99a1a3] transition-colors"
												title="Share this answer"
											>
												<svg
													className="mr-1 w-3 h-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
													<polyline points="16 6 12 2 8 6" />
													<line x1="12" y1="2" x2="12" y2="15" />
												</svg>
												<div className="text-[11px]">Share</div>
											</a>
										</div>
									</div>

									<div className="flex overflow-x-auto gap-2 justify-start">
										{references?.map((ref, index) => (
											<div
												key={index}
												className="flex flex-col p-2 bg-[#cfd5d8] shadow-sm rounded-md w-[30%] md:w-[20%] flex-shrink-0"
											>
												<div className="flex flex-row justify-between mt-1 mb-4 w-full">
													<a
														href="#1"
														className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
														style={{
															padding: "1px 4px",
														}}
													>
														&nbsp;{index + 1}&nbsp;
													</a>
													<div className="text-[10px] text-gray-500">
														{ref.date &&
															`${new Date(ref.date).toLocaleString("default", { month: "short" })} ${new Date(ref.date).getFullYear()}`}
													</div>
												</div>

												<div className="text-[11px] line-clamp-2">
													{ref.title}
												</div>
												<div className="text-[10px] italic text-gray-500 mt-1 mb-1">
													<div className="line-clamp-2">{ref.university}</div>
												</div>
											</div>
										))}
									</div>
								</>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
