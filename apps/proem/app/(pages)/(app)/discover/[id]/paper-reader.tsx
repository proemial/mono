import {
	PaperChat,
	PaperChatProps,
} from "@/app/(pages)/(app)/discover/paper-chat";
import { ChatArticle } from "@/components/chat-article";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
import { use } from "react";

export type PaperReaderProps = {
	paperPromise: Promise<OpenAlexPaper>;
};

export function PaperReader({ paperPromise }: PaperReaderProps) {
	const paper = use(paperPromise);

	return (
		<div className="space-y-6">
			<CollapsibleSection
				trigger={
					<div className="flex items-center gap-4">
						<File02 className="size-4" />
						<Header4>Research Paper</Header4>
					</div>
				}
			>
				<HorisontalScrollArea>
					<a
						href={paper?.data.primary_location.landing_page_url}
						target="_blank"
						rel="noreferrer"
					>
						<PaperCardDiscover
							title={paper?.data.title ?? ""}
							date={paper?.data.publication_date}
							publisher={
								paper?.data.primary_location.source?.display_name ?? ""
							}
						/>
					</a>

					{paper?.data.authorships.map((author) => (
						<PaperCardDiscoverProfile
							key={author.author.id}
							name={author.author.display_name}
						/>
					))}
				</HorisontalScrollArea>
			</CollapsibleSection>

			<ChatArticle
				headline={paper?.generated?.title ?? paper?.data.title}
				model="GPT-4 TURBO"
				type="Summary"
			/>

			{/* <ChatActionBarDiscover /> */}

			<PaperChat
				suggestions={paper?.generated?.starters}
				title={paper?.data.title ?? ""}
				abstract={paper?.data.abstract}
			/>
		</div>
	);
}
