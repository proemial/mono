"use client";
import { EmbedableLink } from "@/components/embedable-link";
import { EngagementIndicator } from "@/components/engagement-indicator";
import Markdown from "@/components/markdown";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { trimForQuotes } from "@/utils/string-utils";
import { Prefix } from "@proemial/redis/adapters/papers";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import { cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Fullscreen } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { FeedItemCard, FeedItemCardProps } from "./feed-item-card";
import { FeedItemTag, FeedItemTagLink } from "./feed-item-tag";
import { getFieldFromOpenAlexTopics } from "./get-field-from-open-alex-topics";

dayjs.extend(relativeTime);

export type FeedItemProps = Pick<
	FeedItemCardProps,
	"isBookmarked" | "customCollectionId" | "onBookmarkToggleClick"
> & {
	paper: OpenAlexPaper & {
		posts: PostWithCommentsAndAuthor[];
		readers: BasicReaderUserData[];
	};
	fingerprint?: RankedPaperFeature[];
	provider?: Prefix;
	children?: ReactNode;
	readonly?: boolean;
	index?: number;
	embedded?: boolean;
	feedType?: string;
};

export default function FeedItem({
	paper,
	fingerprint,
	provider,
	children,
	isBookmarked,
	customCollectionId,
	onBookmarkToggleClick,
	readonly,
	feedType,
	index,
	embedded,
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];
	const field = useMemo(
		() => paper.data.topics && getFieldFromOpenAlexTopics(paper.data.topics),
		[paper.data.topics],
	);
	const hasEngagement = paper.posts.length > 0 || paper.readers.length > 0;

	const linkConfig = {
		path: `/paper/${provider ?? "oa"}/${paper.id}`,
		spaceId: customCollectionId,
		field: field,
		openAssistant: paper.posts.length > 0,
		feedType,
	};

	return (
		<div className="h-full flex flex-col gap-2 justify-between">
			<FeedItemCard
				feedType={feedType}
				isBookmarked={isBookmarked}
				id={paper.id}
				onBookmarkToggleClick={onBookmarkToggleClick}
				// Fall back to publication_date for backwards compatibility
				date={
					paper.data.created_date || (paper.data.publication_date as string)
				}
				topics={paper.data.topics}
				provider={provider}
				customCollectionId={customCollectionId}
				hasAbstract={!!paper.data.abstract}
				readonly={readonly}
				index={index}
			>
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
					<FeatureTags features={fingerprint} linkTo={linkConfig} tags={tags} />
				</div>

				<div className={cn({ "min-h-6": embedded })}>
					{hasEngagement && (
						<div className="mt-2">
							<EmbedableLink {...linkConfig}>
								<EngagementIndicator
									posts={paper.posts}
									readers={paper.readers}
									maxAvatars={embedded ? 3 : undefined}
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
	features,
	linkTo,
	tags,
}: {
	features?: RankedPaperFeature[];
	linkTo: FeedItemTagLink;
	tags?: string[];
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
					<FeedItemTag key={tag} tag={tag} linkTo={linkTo} />
				))}
			</>
		);
	}

	return (
		<>
			{deduped.slice(0, 3).map((feature) => (
				<FeedItemTag key={feature.id} tag={feature.label} linkTo={linkTo} />
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
