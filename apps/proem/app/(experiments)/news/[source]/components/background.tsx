import { NewsItem } from "@proemial/adapters/redis/news";

export function Background({ data }: { data?: NewsItem }) {
	const getLinkCount = (text?: string) => {
		if (!text) return 0;
		const matches = text.match(/\[(.*?)\]/g) || [];
		return matches.reduce((count, match) => {
			return count + match.split(',').length;
		}, 0);
	};
	const linkCount = getLinkCount(data?.generated?.background);

	const formatBackground = (text?: string) => {
		if (!text) return "";
		// Split text into segments based on link pattern
		return text.split(/(\[.*?\])/).map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				// Always split and iterate through numbers
				const numbers = match[1]?.split(",").map((n) => n.trim());
				return numbers?.map((num, j) => (
					<span className="relative inline-block" key={`${i}-${j}`} >
						<a href={`#${num}`} key={`${i}-${j}`} className="relative -top-[2px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-pointer hover:bg-gray-800">
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
		<div className="flex flex-col items-center justify-center gap-2 px-3 pb-2 relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
				Factual Background
			</div>

			<p className="relative self-stretch font-normal text-[#0a161c] text-sm tracking-[0] leading-5">
				{formatBackground(data?.generated?.background)}
			</p>

			<div
				className="w-full font-medium text-[#757989] text-xs leading-5 cursor-pointer"
				onClick={() =>
					document
						.getElementById("sources")
						?.scrollIntoView({ behavior: "smooth" })
				}
			>
				Based on {linkCount} scientific papers ·{" "}
				<span className="underline">View sources</span>
			</div>
		</div>
	);
}
