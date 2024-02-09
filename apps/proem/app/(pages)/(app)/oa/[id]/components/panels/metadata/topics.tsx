import { OpenAlexTopic } from "@proemial/models/open-alex";
import { IconWrapper } from "@/app/(pages)/(app)/oa/[id]/components/icons/wrapper";
import { ConceptsIcon } from "@/app/(pages)/(app)/oa/[id]/components/icons/concepts-icon";

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
    <div key={topic.id}>
      {topic.domain.display_name} &gt;{" "}
      <span className={index === 0 ? "font-bold text-white" : ""}>
        {topic.field.display_name}
      </span>{" "}
      &gt; {topic.subfield.display_name}
    </div>
  );
}
