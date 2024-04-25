import { PaperChat } from "@/app/(pages)/(app)/discover/paper-chat";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { ChatArticle } from "@/components/chat-article";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
import { use } from "react";

export type PaperReaderProps = {
	fetchedPaperPromise: Promise<Omit<OpenAlexPaper, "generated">>;
	generatedPaperPromise: Promise<OpenAlexPaper>;
};

export function PaperReader({
	fetchedPaperPromise,
	generatedPaperPromise,
}: PaperReaderProps) {
	const fetchedPaper = use(fetchedPaperPromise);
	const generatedPaper = use(generatedPaperPromise);

	return (
		<div className="space-y-6">
			<CollapsibleSection
				trackingKey={analyticsKeys.read.click.collapse}
				trigger={
					<div className="flex items-center gap-4">
						<File02 className="size-4" />
						<Header4>Research Paper</Header4>
					</div>
				}
			>
				<HorisontalScrollArea>
					<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
						<a
							href={fetchedPaper.data.primary_location.landing_page_url}
							target="_blank"
							rel="noreferrer"
						>
							<PaperCardDiscover
								title={toTitleCaseIfAllCaps(fetchedPaper.data.title)}
								date={fetchedPaper.data.publication_date}
								publisher={
									fetchedPaper.data.primary_location.source.display_name
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
				headline={generatedPaper.generated?.title ?? fetchedPaper.data.title}
				model="GPT-4 TURBO"
				type="Summary"
				trackingKey={analyticsKeys.read.click.model}
			/>

			{/* <ChatActionBarDiscover /> */}

			<PaperChat
				suggestions={generatedPaper.generated?.starters}
				title={fetchedPaper.data.title}
				abstract={fetchedPaper.data.abstract}
			/>
		</div>
	);
}
