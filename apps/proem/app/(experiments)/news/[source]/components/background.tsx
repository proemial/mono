import { NewsItem } from "@proemial/adapters/redis/news";

export function Background({ data }: { data?: NewsItem }) {
	const formatBackground = (text?: string) => {
		if (!text) return '';
		// Split text into segments based on link pattern
		return text.split(/(\[.*?\])/).map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				// Always split and iterate through numbers
				const numbers = match[1].split(',').map(n => n.trim());
				return numbers.map((num, j) => (
					<a key={`${i}-${j}`} className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-pointer hover:bg-gray-800">
						{num}
					</a>
				));
			}
			// Return regular text for non-link segments
			return segment;
		});
	};
	
	return (
		<div className="flex flex-col items-center justify-center gap-2 px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
			<div className="relative self-stretch mt-[-1.00px] font-semibold text-[#08080a] text-lg tracking-[0] leading-4">
				Factual Background
			</div>

			<p className="relative self-stretch font-normal text-[#08080a] text-sm tracking-[0] leading-5">
				{formatBackground(data?.generated?.background)}
			</p>
		</div>
	);
}
