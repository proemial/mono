import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { limit } from "@proemial/utils/array";

type Props = {
  data: OpenAlexWorkMetadata;
  mainConcept?: string;
};

export function Concepts({ data }: Props) {
  const sorted = (data || []).concepts
    .sort((a, b) => a.level - b.level)
    .reverse();
  if (sorted.length === 0) return null;

  return (
    <div className="flex gap-2 text-white/50 text-xs mt-2 font-sans">
      {sorted.length > 0 &&
        limit(sorted, 5).map((c) => (
          <div
            key={c?.id}
            className="border border-white/50 rounded-md px-2 truncate"
          >
            {c?.display_name}
          </div>
        ))}
    </div>
  );
}
