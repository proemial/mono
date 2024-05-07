import { fetchLatestPapers } from "@/app/(pages)/(app)/discover/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
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
					tags={
						paper.data.topics
							?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
							.filter(Boolean) as string[]
					}
				/>
			))}
		</div>
	);
}
