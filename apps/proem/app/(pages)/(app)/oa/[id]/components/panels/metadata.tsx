import { LinkButton } from "@/app/(pages)/(app)/oa/[id]/components/menu/link-button";
import { Authors } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/authors";
import { Concepts } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/concepts";
import { PaperSource } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/paper-source";
import { Publication } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/publication";
import { Title } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/title";
import { Topics } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata/topics";
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
