"use client";
import { EmbedableLink } from "./embedable-link";
import { EngagementIndicator } from "@/components/engagement-indicator";
import Markdown from "@/components/markdown";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { trimForQuotes } from "@/utils/string-utils";
import { Prefix } from "@proemial/adapters/redis/papers";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode } from "react";
import { FeedItemCard, FeedItemCardProps } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";
// import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";

dayjs.extend(relativeTime);

export type FeedPaper = OpenAlexPaper & {
	posts: PostWithCommentsAndAuthor[];
	readers: BasicReaderUserData[];
	path: string;
};

export type FeedItemProps = Pick<FeedItemCardProps, "customCollectionId"> & {
	paper: FeedPaper;
	fingerprint?: RankedPaperFeature[];
	children?: ReactNode;
};

export default function FeedItem({
	paper,
	fingerprint,
	children,
	customCollectionId,
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];
	// const field = useMemo(
	// 	() => paper.data.topics && getFieldFromOpenAlexTopics(paper.data.topics),
	// 	[paper.data.topics],
	// );
	const hasEngagement = paper.posts.length > 0 || paper.readers.length > 0;

	// const linkConfig = {
	// 	path: `/paper/${provider ?? "oa"}/${paper.id}`,
	// 	spaceId: customCollectionId,
	// 	field: field,
	// 	openAssistant: paper.posts.length > 0,
	// };

	return (
		<div className="h-full flex flex-col gap-2 justify-between">
			<FeedItemCard paper={paper} customCollectionId={customCollectionId}>
				<Markdown>
					{paper.generated?.title
						? trimForQuotes(paper.generated.title)
						: paper.data.title}
				</Markdown>
			</FeedItemCard>

			{children}

			<div>
				<div
					className="flex gap-2 scrollbar-hide overflow-x-auto w-[calc(100%+12px)] -mx-[12px] pl-[12px]"
					style={{
						maskImage:
							"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
					}}
				>
					<FeatureTags
						features={fingerprint}
						paper={paper}
						tags={tags}
						spaceId={customCollectionId}
					/>
				</div>

				<div className="min-h-6">
					{hasEngagement && (
						<div className="mt-2">
							<EmbedableLink path={paper.path} spaceId={customCollectionId}>
								<EngagementIndicator
									posts={paper.posts}
									readers={paper.readers}
									maxAvatars={3}
								/>
							</EmbedableLink>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function FeatureTags({
	paper,
	features,
	tags,
	spaceId,
}: {
	paper: FeedPaper;
	features?: RankedPaperFeature[];
	tags?: string[];
	spaceId?: string;
}) {
	const sorted = features?.length
		? [...features]
				.filter((f) => !f.irrelevant)
				.sort((a, b) => typeScore(b.type) - typeScore(a.type))
		: [];

	const deduped = [] as RankedPaperFeature[];
	for (const feature of sorted) {
		if (deduped.find((f) => f.label === feature.label)) {
			continue;
		}
		deduped.push(feature);
	}

	if (deduped.length === 0) {
		return (
			<>
				{tags?.slice(0, 3).map((tag) => (
					<FeedItemTag key={tag} paper={paper} tag={tag} spaceId={spaceId} />
				))}
			</>
		);
	}

	return (
		<>
			{deduped.slice(0, 3).map((feature) => (
				<FeedItemTag
					key={feature.id}
					paper={paper}
					tag={feature.label}
					spaceId={spaceId}
				/>
			))}
		</>
	);
}

function typeScore(type: FeatureType) {
	switch (type) {
		case "keyword":
			return 9;
		case "topic":
			return 0.5;
		default:
			return 0.3;
	}
}
