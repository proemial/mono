"use server";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/(discover)/get-bookmarks-by-user-id";
import { auth } from "@clerk/nextjs";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { FeedItemCard } from "../(discover)/feed-item-card";
import Markdown from "@/components/markdown";
import { Users01 } from "@untitled-ui/icons-react";

export async function Paper({ paper }: { paper: OpenAlexWorkMetadata }) {
	const { userId } = await auth();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};

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
