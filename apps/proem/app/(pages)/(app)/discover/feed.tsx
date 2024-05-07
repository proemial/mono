import { TabNavigation } from "@/app/(pages)/(app)/discover/[id]/feed-filter";
import { fetchLatestPapers } from "@/app/(pages)/(app)/discover/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { OaTopics } from "@proemial/models/open-alex-topics";
import { use } from "react";

export type FeedProps = {
	fetchedPapersPromise: ReturnType<typeof fetchLatestPapers>;
};

export function Feed({ fetchedPapersPromise }: FeedProps) {
	const papers = use(fetchedPapersPromise);

	return (
		<div className="space-y-6">
			<HorisontalScrollArea>
				<TabNavigation
					items={[
						"all",
						...OaTopics.map((concept) => concept.display_name.toLowerCase()),
					]}
					rootPath="/discover"
				/>
			</HorisontalScrollArea>

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
