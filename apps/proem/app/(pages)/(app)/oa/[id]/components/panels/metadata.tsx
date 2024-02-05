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

export function Metadata({ paper }: { paper: OpenAlexPaper }) {
  return (
    <div className="flex flex-col gap-3 font-sans text-xs leading-4">
      <Title>{paper.data.title}</Title>
      <Authors authorships={paper.data.authorships} />
      <PublicationDate>{paper.data.publication_date}</PublicationDate>
      <Concepts concepts={(paper.data as OpenAlexWorkMetadata).concepts} />
      <RelatedPapers papers={paper.data.related_works} />
      <PaperSource>{paper.data.primary_location?.landing_page_url}</PaperSource>
      <LinkButton url={paper.data.primary_location?.landing_page_url} />
    </div>
  );
}
