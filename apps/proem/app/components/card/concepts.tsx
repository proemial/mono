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

  return (
    <>
      {asTags && (
        <div className=" text-xs text-white/50 truncate">
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
      )}
      {!asTags && (
        <div className="flex gap-2 text-white/50 text-xs mt-2 font-sans truncate">
          {limit(sorted, 3).map((c) => (
            <div key={c?.id} className="border border-white/50 rounded-md px-2">
              {c?.display_name}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
