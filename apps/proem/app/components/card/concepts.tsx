import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { limit } from "@proemial/utils/array";

type Props = {
	data: OpenAlexWorkMetadata;
	asTags?: boolean;
};

export function Concepts({ data, asTags }: Props) {
	const sorted = (data || []).concepts
		.sort((a, b) => a.level - b.level)
		.reverse();
	if (sorted.length === 0) return null;
	if (asTags) {
		return (
			<div className="mt-1 text-xs truncate text-white/50">
				{limit(sorted, 3)
					.map(
						(c) =>
							`#${c.display_name
								.toLowerCase()
								.replaceAll(" ", "-")
								.replaceAll(",", "-")}`,
					)
					.join(" ")}
			</div>
		);
	}

	return (
		<div className="mt-2 mb-1 flex gap-2 text-xs truncate text-white/50">
			{limit(sorted, 3).map((c) => (
				<div
					key={c?.id}
					className="px-2 border rounded-md border-white/50 text-xs"
				>
					{c?.display_name}
				</div>
			))}
		</div>
	);
}
