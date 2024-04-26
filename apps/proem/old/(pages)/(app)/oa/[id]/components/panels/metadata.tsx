import { LinkButton } from "@/old/(pages)/(app)/oa/[id]/components/menu/link-button";
import { Authors } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/authors";
import { Concepts } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/concepts";
import { PaperSource } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/paper-source";
import { Publication } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/publication";
import { Title } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/title";
import { Topics } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata/topics";
import {
	OpenAlexPaper,
	OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";

export function Metadata({ paper }: { paper: OpenAlexPaper }) {
	return (
		<div className="flex flex-col gap-3 text-xs leading-4">
			<Title>{paper.data.title}</Title>
			<Authors authorships={paper.data.authorships} />
			<Publication paper={paper} />
			<Concepts concepts={(paper.data as OpenAlexWorkMetadata).concepts} />
			<Topics concepts={(paper.data as OpenAlexWorkMetadata).topics} />
			<PaperSource>{paper.data.primary_location?.landing_page_url}</PaperSource>
			<LinkButton url={paper.data.primary_location?.landing_page_url} />
		</div>
	);
}
