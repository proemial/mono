"use client";
import Markdown from "@/components/markdown";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { Users01 } from "@untitled-ui/icons-react";
import { Bookmarks } from "../space/(discover)/add-to-collection-button";
import { FeedItemCard } from "../space/(discover)/feed-item-card";
import { Button, buttonVariants } from "@proemial/shadcn-ui";

export function Paper({
	paper,
	bookmarks,
}: { paper: OpenAlexWorkMetadata; bookmarks: Bookmarks }) {
	if (!paper) {
		return null;
	}

	return (
		<div className="space-y-3 bg-white dark:bg-primary rounded-lg p-4">
			<FeedItemCard
				id={paper.id}
				date={paper.publication_date}
				topics={paper.topics}
				// provider={provider}
				bookmarks={bookmarks}
				// customCollectionId={customCollectionId}
				hasAbstract={!!paper.abstract_inverted_index}
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
