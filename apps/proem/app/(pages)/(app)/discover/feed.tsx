import { TabNavigation } from "@/app/(pages)/(app)/discover/[id]/feed-filter";
import { fetchLatestPapers } from "@/app/(pages)/(app)/discover/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { DragScrollContainer } from "@/components/drag-scroll";
import { OaTopics } from "@proemial/models/open-alex-topics";
import { use } from "react";

export type FeedProps = {
	fetchedPapersPromise: ReturnType<typeof fetchLatestPapers>;
};
export function Feed({ fetchedPapersPromise }: FeedProps) {
	const papers = use(fetchedPapersPromise);

	console.log(papers);

	return (
		<div className="space-y-6">
			{/* <DragScrollContainer className="flex justify-center my-4">
				<TabNavigation
					items={[
						"all",
						...OaTopics.map((concept) => concept.display_name.toLowerCase()),
					]}
					rootPath="/discover"
				/>
			</DragScrollContainer> */}

			{papers.map((paper) => (
				<FeedItem
					key={paper.id}
					date={paper.data.publication_date}
					title={paper.data.title}
					tags={["sdf"]}
				/>
			))}
		</div>
	);
}
