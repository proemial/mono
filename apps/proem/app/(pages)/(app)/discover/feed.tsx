import { FeedFilter } from "@/app/(pages)/(app)/discover/feed-filter";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { fetchLatestPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
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
		<div className="flex flex-col gap-10 pb-10">
			<HorisontalScrollArea>
				<FeedFilter
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
					fields={paper.data.topics?.map((topic) => ({
						id: topic.field.id,
						score: topic.score,
					}))}
					tags={
						paper.data.topics
							?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
							.filter(Boolean) as string[]
					}
					href={`/paper/oa/${paper.id}`}
				/>
			))}
		</div>
	);
}
