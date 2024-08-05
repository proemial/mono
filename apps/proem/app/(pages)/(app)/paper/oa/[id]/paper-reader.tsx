import { PaperReaderHeadlineProps } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-headline";
import { PaperChat } from "@/app/(pages)/(app)/space/(discover)/paper-chat";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ChatArticle } from "@/components/chat-article";
import { MessageWithAuthorUserData } from "@/services/post-service";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { use } from "react";
import { addPaperActivity } from "./paper-activity";

type PaperReaderProps = Pick<PaperReaderHeadlineProps, "isBookmarked"> & {
	fetchedPaperPromise: Promise<Omit<OpenAlexPaper, "generated">>;
	generatedPaperPromise: Promise<OpenAlexPaper>;
	initialMessages: MessageWithAuthorUserData[];
	type: "oa" | "arxiv";
	collectionId?: Collection["id"];
};

export function PaperReader({
	fetchedPaperPromise,
	generatedPaperPromise,
	initialMessages,
	type,
	collectionId,
	isBookmarked,
}: PaperReaderProps) {
	const fetchedPaper = use(fetchedPaperPromise);
	const generatedPaper = use(generatedPaperPromise);

	if (type === "oa") {
		// Only register paper read activity on OpenAlex papers
		void use(addPaperActivity(fetchedPaper.id));
	}

	return (
		<div className="flex flex-col gap-5 h-full justify-between">
			<div className="space-y-5">
				<ChatArticle
					type="Paper Summary"
					trackingKeys={analyticsKeys.read}
					paper={generatedPaper}
					customCollectionId={collectionId}
					isBookmarked={isBookmarked}
				/>
			</div>

			<PaperChat
				suggestions={generatedPaper.generated?.starters}
				title={fetchedPaper.data.title}
				paperId={fetchedPaper.id}
				abstract={fetchedPaper.data.abstract}
				initialMessages={initialMessages}
				spaceId={collectionId}
			/>
		</div>
	);
}
