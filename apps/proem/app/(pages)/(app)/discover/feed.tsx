import { FeedFilter } from "@/app/(pages)/(app)/discover/feed-filter";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { fetchLatestPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { OaFields } from "@proemial/models/open-alex-fields";
import { use } from "react";
import { FeedFilterTree } from "./topics/feed-filter-tree";

export type FeedProps = {
	fetchedPapersPromise: ReturnType<typeof fetchLatestPapers>;
	treeFilter?: boolean;
};

export function Feed({ fetchedPapersPromise, treeFilter }: FeedProps) {
	const papers = use(fetchedPapersPromise);

	return (
		<div className="flex flex-col gap-10 pb-10">
			{treeFilter && <FeedFilterTree rootPath="/discover/topics" />}

			{!treeFilter && (
				<HorisontalScrollArea>
					<FeedFilter
						items={[
							"all",
							...OaFields.map((field) => field.display_name.toLowerCase()),
						]}
						rootPath="/discover"
					/>
				</HorisontalScrollArea>
			)}

			{papers.map((paper) => (
				<FeedItem
					id={paper.id}
					key={paper.id}
					date={paper.data.publication_date}
					fields={
						paper.data.topics?.map((topic) => ({
							id: topic.field.id,
							score: topic.score,
						})) ?? []
					}
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
