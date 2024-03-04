import { fetchLatestPapers } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { CardList } from "@/app/components/card/card-list";
import { CenteredSpinner } from "@/app/components/loading/spinner";
import { OaTopics } from "@proemial/models/open-alex-topics";
import { Suspense } from "react";

export const revalidate = 1;

type Props = {
	params: { key: string };
};

export default async function FrontPage({ params }: Props) {
	const conceptId = OaTopics.find(
		(c) =>
			c.display_name.toLowerCase() ===
			decodeURI(params.key).replaceAll("%2C", ","),
	)?.id;

	const papers = await fetchLatestPapers(conceptId);

	return (
		<div>
			<Suspense fallback={<CenteredSpinner />}>
				<CardList papers={papers} />
			</Suspense>
		</div>
	);
}
