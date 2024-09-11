import { AddToCollectionButtonProps } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ChatArticle } from "@/components/chat-article";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { use } from "react";
import { addPaperActivity } from "./paper-activity";

type PaperReaderProps = Pick<AddToCollectionButtonProps, "isBookmarked"> & {
	fetchedPaperPromise: Promise<Omit<OpenAlexPaper, "generated">>;
	generatedPaperPromise: Promise<OpenAlexPaper>;
	paperPostsPromise: Promise<PostWithCommentsAndAuthor[]>;
	type: "oa" | "arxiv";
	collectionId?: Collection["id"];
	readers: BasicReaderUserData[];
};

export function PaperReader({
	fetchedPaperPromise,
	generatedPaperPromise,
	paperPostsPromise,
	type,
	collectionId,
	isBookmarked,
	readers,
}: PaperReaderProps) {
	const fetchedPaper = use(fetchedPaperPromise);
	const generatedPaper = use(generatedPaperPromise);
	const paperPosts = use(paperPostsPromise);

	if (type === "oa") {
		// Only register paper read activity on OpenAlex papers
		void use(addPaperActivity(fetchedPaper.id));
	}

	return (
		<div className="flex flex-col h-full pb-[118px]">
			<ChatArticle
				type="Paper Summary"
				trackingKeys={analyticsKeys.read}
				paper={generatedPaper}
				customCollectionId={collectionId}
				isBookmarked={isBookmarked}
				paperPosts={paperPosts}
				readers={readers}
			/>
		</div>
	);
}
