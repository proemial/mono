import { ConceptsIcon } from "@/old/(pages)/(app)/oa/[id]/components/icons/concepts-icon";
import { IconWrapper } from "@/old/(pages)/(app)/oa/[id]/components/icons/wrapper";
import { OpenAlexTopic } from "@proemial/models/open-alex";

export function Topics({ concepts }: { concepts?: OpenAlexTopic[] }) {
	return (
		<>
			{concepts && concepts?.length > 0 && (
				<div>
					<IconWrapper>
						<ConceptsIcon />
						Topics
					</IconWrapper>
					<div className="text-white/50">
						{concepts.map((t, i) => (
							<Topic key={t.id} topic={t} index={i} />
						))}
					</div>
				</div>
			)}
		</>
	);
}
function Topic({ topic, index }: { topic: OpenAlexTopic; index: number }) {
	return (
		<div key={topic.id} className="mb-2">
			{topic.domain.display_name} &gt;{" "}
			<span className={index === 0 ? "font-bold" : ""}>
				{topic.field.display_name}
			</span>{" "}
			&gt; {topic.subfield.display_name}
			&gt; <span className="text-white">{topic.display_name}</span>
		</div>
	);
}
