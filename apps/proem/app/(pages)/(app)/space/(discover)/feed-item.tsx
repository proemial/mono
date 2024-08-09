"use client";
import { AuthorAvatar } from "@/components/author-avatar";
import Markdown from "@/components/markdown";
import { PaperPost } from "@/services/post-service";
import { trimForQuotes } from "@/utils/string-utils";
import { Prefix } from "@proemial/redis/adapters/papers";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode } from "react";
import { FeedItemCard, FeedItemCardProps } from "./feed-item-card";
import { FeedItemTag } from "./feed-item-tag";

dayjs.extend(relativeTime);

export type FeedItemProps = Pick<
	FeedItemCardProps,
	"isBookmarked" | "customCollectionId" | "onBookmarkToggleClick"
> & {
	paper: OpenAlexPaper & { posts: PaperPost[] };
	fingerprint?: RankedPaperFeature[];
	provider?: Prefix;
	children?: ReactNode;
	readonly?: boolean;
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
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];

	const distinctAuthors = paper.posts.reduce(
		(authors: PaperPost["author"][], post) => {
			if (!authors.find((author) => author.id === post.author.id)) {
				authors.push(post.author);
			}
			return authors;
		},
		[],
	);

	return (
		<div className="space-y-3">
			<FeedItemCard
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
			>
				<Markdown>
					{paper.generated?.title
						? trimForQuotes(paper.generated.title)
						: paper.data.title}
				</Markdown>
			</FeedItemCard>

			{children}

			<div
				className="flex gap-2 scrollbar-hide overflow-x-auto w-[calc(100%+12px)] -mx-[12px] pl-[12px]"
				style={{
					maskImage:
						"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
				}}
			>
				{!fingerprint &&
					tags?.map((tag) => <FeedItemTag key={tag} tag={tag} />)}

				{fingerprint && <FeatureTags features={fingerprint} />}
			</div>

			{paper.posts.length > 0 && (
				<div className="flex gap-2">
					<div className="flex gap-2">
						{distinctAuthors.map((author, index) => (
							<AuthorAvatar
								key={index}
								firstName={author.firstName}
								lastName={author.lastName}
								imageUrl={author.imageUrl}
							/>
						))}
					</div>
					<div className="text-sm opacity-90">
						{formatQuestionsAskedLabel(paper.posts.length)}
					</div>
				</div>
			)}
		</div>
	);
}

const formatQuestionsAskedLabel = (count: number) =>
	count === 1 ? "1 question asked" : `${count} questions asked`;

function FeatureTags({ features }: { features: RankedPaperFeature[] }) {
	const sorted = [...features]
		.filter((f) => !f.irrelevant)
		.sort((a, b) => typeScore(b.type) - typeScore(a.type));

	const deduped = [] as RankedPaperFeature[];
	for (const feature of sorted) {
		if (deduped.find((f) => f.label === feature.label)) {
			continue;
		}
		deduped.push(feature);
	}

	if (deduped.length === 0) {
		return null;
	}

	return (
		<>
			{deduped.slice(0, 3).map((feature) => (
				<FeedItemTag key={feature.id} tag={feature.label} />
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
