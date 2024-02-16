import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { LinkButton } from "@/app/(pages)/(app)/oa/[id]/components/menu/link-button";
import { Authors } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/authors";
import { PublicationDate } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/publication-date";
import { Concepts } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/concepts";
import { RelatedPapers } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/related-papers";
import { PaperSource } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/paper-source";
import { Title } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/title";
import { CardList } from "@/app/components/card/card-list";
import { fetchLatestPapers } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";

export function Related({ paper }: { paper: OpenAlexPaper }) {
  console.log("paper.data.related_works", paper.data.related_works);

  return (
    <div className="flex flex-col gap-3 font-sans text-xs leading-4">
      <CardList ids={paper.data.related_works} />
    </div>
  );
}
