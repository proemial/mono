import { ConceptsIcon } from "@/app/(pages)/(app)/oa/[id]/components/icons/concepts-icon";
import { IconWrapper } from "@/app/(pages)/(app)/oa/[id]/components/icons/wrapper";
import { OpenAlexConcept } from "@proemial/models/open-alex";

export function Concepts({ concepts }: { concepts?: OpenAlexConcept[] }) {
	const sorted = (concepts || []).sort((a, b) => a.level - b.level);

	return (
		<>
			{sorted?.length > 0 && (
				<div>
					<IconWrapper>
						<ConceptsIcon />
						Concepts
					</IconWrapper>
					<div className="text-white/50">
						{/* TODO: Show a max of 3 with plus expansion */}
						{sorted
							.map(
								(c) => `#${c.display_name.toLowerCase().replaceAll(" ", "-")}`,
							)
							.join(", ")}
					</div>
				</div>
			)}
		</>
	);
}
