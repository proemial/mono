import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { limit } from "@proemial/utils/array";

export function Concepts({ data }: { data: OpenAlexWorkMetadata }) {
  const sorted = (data || []).concepts.sort((a, b) => a.level - b.level);
  const filtered = sorted
    ? [sorted.at(0), ...limit(sorted.slice(1), 2, true)]
    : [];

  if (sorted.length === 0) return null;

  return (
    <div className="flex gap-2 text-xs text-white/50 mt-2 font-sans">
      {filtered && (
        <div
          key={filtered[0]?.id}
          className="border border-white/50 rounded-md px-2 whitespace-nowrap"
        >
          {filtered[0]?.display_name}
        </div>
      )}
      {sorted.length > 1 &&
        filtered?.slice(1).map((c) => (
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
