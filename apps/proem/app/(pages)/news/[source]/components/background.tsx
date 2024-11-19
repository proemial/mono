import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { References } from "./references/references";

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
									className="items-center justify-center rounded-[3px] bg-gray-700 text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
									style={{
										padding: "2px 2px",
										marginRight: "2px",
										position: "relative",
										top: "-2px",
									}}
								>
									&nbsp;{num}&nbsp;
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
		<div className="flex flex-col p-3 w-full">
			<div className="flex items-start w-full text-lg leading-4 font-semibold text-[#08080a] mb-2">
				Related Scientific Facts
				<div className="text-[#757989] ml-1 text-sm font-normal">
					by Science bot
				</div>
			</div>

			<div className="relative self-stretch font-normal text-[#1a2930] tracking-[0] leading-6">
				{formatBackground(text)}
			</div>
			<div className="relative self-stretch mt-4 mb-2 text-[#757989] text-[12px]">
				Scientific references used
			</div>
			<div className="flex justify-start gap-2 overflow-x-auto">
				{references?.map((ref, index) => (
					<div
						key={index}
						className="flex flex-col p-2 bg-gray-100 rounded-md w-[30%] md:w-[20%] flex-shrink-0"
					>
						<div className="flex flex-row w-full justify-between mt-1 mb-4">
							<a
								href="#1"
								className="items-center justify-center rounded-[3px]  bg-gray-700 text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
								style={{
									padding: "1px 3px",
									marginRight: "1px",
									position: "relative",
									top: "-2px",
								}}
							>
								&nbsp;{index + 1}&nbsp;
							</a>
							<div className="text-[10px] text-gray-500">
								{ref.date &&
									`${new Date(ref.date).toLocaleString("default", { month: "short" })} ${new Date(ref.date).getFullYear()}`}
							</div>
						</div>

						<div className="text-[11px] line-clamp-2">{ref.title}</div>
						<div className="text-[10px] italic text-gray-500 mt-1 mb-1">
							<div className="line-clamp-2">{ref.university}</div>
						</div>
					</div>
				))}
			</div>

			{/* 			
			<div className="flex justify-start">
				<Trackable
					trackingKey={
						analyticsKeys.experiments.news.item
							.clickViewAllSourcesFactualBackground
					}
					properties={{ sourceUrl: url }}
				>
					<div
						className="font-medium text-[#757989] text-xs leading-5"
						onClick={() =>
							document
								.getElementById("sources")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						Based on {linkCount} scientific papers ·{" "}
						<span className="underline cursor-pointer">View all sources</span>
					</div>
				</Trackable>
			</div> */}
		</div>
	);
}
