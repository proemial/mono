import {
	PaperReaderHeadline,
	PaperReaderHeadlineProps,
} from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-headline";
import { PaperChat } from "@/app/(pages)/(app)/space/(discover)/paper-chat";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ChatArticle } from "@/components/chat-article";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { Trackable } from "@/components/trackable";
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
	isBookmarked,
	type,
	collectionId,
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
				<CollapsibleSection
					trackingKey={analyticsKeys.read.click.collapse}
					trigger={
						<PaperReaderHeadline
							paperId={fetchedPaper.id}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
						/>
					}
					collapsed
				>
					<HorisontalScrollArea>
						<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
							<a
								href={fetchedPaper.data.primary_location?.landing_page_url}
								target="_blank"
								rel="noreferrer"
							>
								<PaperCardDiscover
									title={fetchedPaper.data.title}
									date={fetchedPaper.data.publication_date}
									publisher={
										fetchedPaper.data.primary_location.source?.display_name
									}
								/>
							</a>
						</Trackable>

						{fetchedPaper.data.authorships.map((author) => (
							<PaperCardDiscoverProfile
								key={author.author.id}
								name={author.author.display_name}
							/>
						))}
					</HorisontalScrollArea>
				</CollapsibleSection>
				<ChatArticle
					type="Summary"
					trackingKeys={analyticsKeys.read}
					paper={generatedPaper}
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
