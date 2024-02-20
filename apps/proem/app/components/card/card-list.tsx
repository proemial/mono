import { ClickablePaperCard } from "@/app/components/card/clickable-card";
import { FeedPaper } from "@/app/components/card/feed-paper";
import { CenteredSpinner, NothingHere } from "@/app/components/spinner";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Suspense } from "react";

export function CardList({ papers }: { papers?: OpenAlexPaper[] }) {
	if (papers?.length === 0) {
		return <NothingHere>No papers found</NothingHere>;
	}

	return (
		<div className="flex flex-col max-w-screen-sm pb-20 mx-auto justify-begin">
			{papers?.map((paper, index) => (
				<Suspense key={index} fallback={<CenteredSpinner />}>
					<ClickablePaperCard id={paper.id}>
						<FeedPaper paper={paper} />
					</ClickablePaperCard>
				</Suspense>
			))}
		</div>
	);
}
