"use client";
import Markdown from "@/components/markdown";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { Users01 } from "@untitled-ui/icons-react";
import { Bookmarks } from "../space/(discover)/add-to-collection-button";
import { FeedItemCard } from "../space/(discover)/feed-item-card";

export function Paper({
	paper,
	bookmarks,
	collectionId,
}: {
	paper: OpenAlexWorkMetadata;
	bookmarks: Bookmarks;
	collectionId?: Collection["id"];
}) {
	if (!paper) {
		return null;
	}

	return (
		<div className="p-4 space-y-3 bg-white rounded-lg">
			<FeedItemCard
				id={paper.id}
				date={paper.publication_date}
				topics={paper.topics}
				isBookmarked={Boolean(bookmarks?.[paper.id] ?? false)}
				hasAbstract={!!paper.abstract_inverted_index}
				customCollectionId={collectionId}
			>
				<Markdown>{paper.title}</Markdown>
			</FeedItemCard>

			<div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide text-muted-foreground">
				{paper.authorships?.map((author, i) => (
					<div key={i} className="flex items-center gap-1 text-nowrap">
						<Users01 className="size-4" />
						{author.author.display_name}
					</div>
				))}
			</div>
		</div>
	);
}
