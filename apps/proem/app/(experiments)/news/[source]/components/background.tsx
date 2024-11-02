import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";

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
						<span className="" key={`${i}-${j}`}>
							<a
								href={`#${num}`}
								key={`${i}-${j}`}
								onClick={() =>
									document
										.getElementById("sources")
										?.scrollIntoView({ behavior: "smooth" })
								}
								className="items-center justify-center rounded-full bg-black text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
								style={{ padding: "3px", position: "relative", top: "-2px" }}
							>
								&nbsp;{num}&nbsp;
							</a>
						</span>
					));
				}
				// Return regular text for non-link segments
				return segment;
			});
	};

	return (
		<div className="flex flex-col gap-2 px-3 pb-2 w-full">
			<div className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative">
				<div className="relative mt-[-1.00px] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
					Factual Background
				</div>
				<div className="px-1.5 py-0.5 ml-0.5 relative bg-black rounded-full  ">
					<div className="relative w-fit font-semibold text-[#6aba6f] text-xs leading-3 whitespace-nowrap">
						Science bot
					</div>
				</div>
			</div>

			<div className="relative self-stretch font-normal text-[#1a2930] tracking-[0] leading-6">
				{formatBackground(text)}
			</div>

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
			</div>
		</div>
	);
}
