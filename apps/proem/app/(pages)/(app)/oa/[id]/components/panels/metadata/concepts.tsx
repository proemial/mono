import { OpenAlexConcept } from "@proemial/models/open-alex";

export function Concepts({ concepts }: { concepts?: OpenAlexConcept[] }) {
  const sorted = (concepts || []).sort((a, b) => a.level - b.level);

  return (
    <>
      {sorted?.length > 0 && (
        <div>
          <div>Concepts</div>
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
