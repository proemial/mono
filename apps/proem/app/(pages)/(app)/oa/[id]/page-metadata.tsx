import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import Link from "next/link";
import { LinkButton } from "@/app/(pages)/(app)/oa/[id]/components/menu/link-button";
import dayjs from "dayjs";

export function Metadata({ paper }: { paper: OpenAlexPaper }) {
  const concepts = ((paper.data as OpenAlexWorkMetadata) || []).concepts.sort(
    (a, b) => a.level - b.level,
  );

  return (
    <div className="flex flex-col gap-3 font-sans text-xs leading-4">
      <div>
        <div>Title</div>
        <div className="text-white/50">{paper.data.title}</div>
      </div>
      <div>
        <div>Authors</div>
        <div className="text-white/50 flex flex-wrap">
          {/* TODO: Show a max of 3 with expansion */}
          {paper.data.authorships.map((authorship) => (
            <Author authorship={authorship} />
          ))}
        </div>
      </div>
      <div>
        <div>Publication date</div>
        <div className="text-white/50">
          {dayjs(paper.data.publication_date).format("D MMM YYYY")}
        </div>
      </div>
      <div>
        <div>Concepts</div>
        <div className="text-white/50">
          {/* TODO: Show a max of 3 with plus expansion */}
          {concepts
            .map((c) => `#${c.display_name.toLowerCase().replaceAll(" ", "-")}`)
            .join(", ")}
        </div>
      </div>
      <div>
        <div>Related Papers</div>
        <div className="text-white/50 text-wrap">
          {paper.data.related_works.map((w) => (
            <span
              key={w}
              className="mr-1 border border-white/50 px-1 rounded-md"
            >
              <Link href={`/oa${w.substring(w.lastIndexOf("/"))}`}>
                {w.substring(w.lastIndexOf("/") + 1)}
              </Link>{" "}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div>Source</div>
        <div className="text-white/50">
          {paper.data.primary_location?.landing_page_url}
        </div>
      </div>
      <LinkButton url={paper.data.primary_location?.landing_page_url} />
    </div>
  );
}

type Props = {
  authorship: OpenAlexPaper["data"]["authorships"][0];
};

function Author({ authorship }: Props) {
  const { id, display_name } = authorship.author;
  const name = `${display_name.charAt(0)}. ${display_name.split(" ").pop()}`;

  return (
    <div
      key={id}
      className="mr-1 border border-white/50 px-1 rounded-md text-nowrap"
    >
      {name}
    </div>
  );
}
