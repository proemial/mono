import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";

type Props = {
  data: OpenAlexWorkMetadata;
  mainTopic?: string;
};

export function Topics({ data }: Props) {
  if (!data.topics) return null;

  return (
    <div className="text-white/50 text-xs mt-2 font-sans break-words">
      {data.topics.length > 0 &&
        data.topics.map((t) => (
          <span key={t?.id} className="whitespace-nowrap mr-2">
            #{t?.subfield.display_name.replaceAll(" ", "-").replaceAll(",", "")}
          </span>
        ))}
    </div>
  );
}
