import { PaperChat } from "@/app/(pages)/(app)/discover/paper-chat";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ChatArticle } from "@/components/chat-article";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { Trackable } from "@/components/trackable";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
import { Message, nanoid } from "ai";
import { use } from "react";
import { PaperPost, UserData } from "../../paper-post-utils";

export type PaperReaderProps = {
	fetchedPaperPromise: Promise<Omit<OpenAlexPaper, "generated">>;
	generatedPaperPromise: Promise<OpenAlexPaper>;
	paperPosts: PaperPost[];
};

export function PaperReader({
	fetchedPaperPromise,
	generatedPaperPromise,
	paperPosts,
}: PaperReaderProps) {
	const fetchedPaper = use(fetchedPaperPromise);
	const generatedPaper = use(generatedPaperPromise);
	const initialMessages = paperPostsToMessages(paperPosts);

	return (
		<div className="space-y-4">
			<div className="space-y-5">
				<CollapsibleSection
					trackingKey={analyticsKeys.read.click.collapse}
					trigger={
						<div className="flex items-center gap-3">
							<File02 className="size-5" />
							<Header4>Research Paper</Header4>
						</div>
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

				<PaperChat
					suggestions={generatedPaper.generated?.starters}
					title={fetchedPaper.data.title}
					paperId={fetchedPaper.id}
					abstract={fetchedPaper.data.abstract}
					initialMessages={initialMessages}
				/>
			</div>
		</div>
	);
}

/**
 * Simple conversion from paper posts to Vercel AI messages. Returns posts and
 * replies in a flat array.
 *
 * Additions:
 *   - Added a non-null `createdAt` field to each message.
 *   - Added author user data to each message.
 */
const paperPostsToMessages = (
	paperPosts: PaperPost[],
): MessageWithAuthorUserData[] => {
	const messages: MessageWithAuthorUserData[] = [];
	for (const post of paperPosts) {
		messages.push({
			id: nanoid(),
			role: "user",
			content: post.content,
			createdAt: post.createdAt,
			authorUserData: post.authorUserData,
		});
		for (const comment of post.comments) {
			messages.push({
				id: nanoid(),
				role: "assistant",
				content: comment.content,
				createdAt: comment.createdAt,
				authorUserData: comment.authorUserData,
			});
		}
	}
	return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

export type MessageWithAuthorUserData = Message & {
	createdAt: Date;
	authorUserData?: UserData;
};
