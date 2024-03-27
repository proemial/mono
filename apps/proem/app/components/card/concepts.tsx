import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { limit } from "@proemial/utils/array";

type Props = {
	data: OpenAlexWorkMetadata;
};

export function Concepts({ data }: Props) {
	const sorted = [...(data || []).concepts]
		.sort((a, b) => a.level - b.level)
		.reverse();
	if (sorted.length === 0) return null;

	return (
		<ConceptBoxes concepts={sorted.map(s => s.display_name)} />
	);
}

export function ConceptBoxes({ concepts }: { concepts: string[] }) {
	return (
		<div className="flex gap-2 mt-2 mb-1 text-xs truncate text-white/50">
			{limit(concepts, 3).map((c) => (
				<div
					key={c}
					className="px-2 text-xs border rounded-md border-white/50"
				>
					{c}
				</div>
			))}
		</div>
	);
}
