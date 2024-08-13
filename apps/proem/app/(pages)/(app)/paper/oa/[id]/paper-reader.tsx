import { PaperReaderHeadlineProps } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-headline";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ChatArticle } from "@/components/chat-article";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { use } from "react";
import { addPaperActivity } from "./paper-activity";

type PaperReaderProps = Pick<PaperReaderHeadlineProps, "isBookmarked"> & {
	fetchedPaperPromise: Promise<Omit<OpenAlexPaper, "generated">>;
	generatedPaperPromise: Promise<OpenAlexPaper>;
	type: "oa" | "arxiv";
	collectionId?: Collection["id"];
};

export function PaperReader({
	fetchedPaperPromise,
	generatedPaperPromise,
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
		<div className="flex flex-col h-full pb-[118px]">
			<ChatArticle
				type="Paper Summary"
				trackingKeys={analyticsKeys.read}
				paper={generatedPaper}
				customCollectionId={collectionId}
				isBookmarked={isBookmarked}
			/>
		</div>
	);
}
