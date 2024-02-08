import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { limit } from "@proemial/utils/array";

type Props = {
  data: OpenAlexWorkMetadata;
  mainConcept?: string;
};

export function Concepts({ data, mainConcept }: Props) {
  const sorted = (data || []).concepts.sort((a, b) => a.level - b.level);
  if (sorted.length === 0) return null;

  const first = mainConcept
    ? sorted.find((c) => c.id === mainConcept)
    : sorted.at(0);
  const rest = sorted.filter((c) => c.id !== first?.id).reverse();

  const color = mainConcept
    ? "bg-white/50 text-black"
    : "border border-white/50";

  return (
    <div className="flex gap-2 text-white/50 text-xs mt-2 font-sans">
      {first && (
        <div
          key={first?.id}
          className={`flex items-center rounded-md px-2 whitespace-nowrap ${color}`}
        >
          {first?.display_name}
        </div>
      )}
      {rest.length > 0 &&
        limit(rest, 2).map((c) => (
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
