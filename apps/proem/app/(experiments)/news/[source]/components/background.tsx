import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { NewsItem } from "@proemial/adapters/redis/news";

export function Background({ text }: { text?: string }) {
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
		<div className="flex flex-col gap-2 px-3 pb-2 w-full">
			<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
				Factual Background
			</div>

			<div className="relative self-stretch font-normal text-[#1a2930] tracking-[0] leading-6">
				{formatBackground(text)}
			</div>

			<div className="flex justify-start">
				<div className="font-medium text-[#757989] text-xs leading-5">
					Based on {linkCount} scientific papers ·{" "}
					<Trackable
						trackingKey={
							analyticsKeys.experiments.news.item
								.clickViewAllSourcesFactualBackground
						}
						properties={{ sourceUrl: data?.source?.url ?? "" }}
					>
						<span
							className="underline cursor-pointer"
							onClick={() =>
								document
									.getElementById("sources")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							View all sources
						</span>
					</Trackable>
				</div>
			</div>
		</div>
	);
}
