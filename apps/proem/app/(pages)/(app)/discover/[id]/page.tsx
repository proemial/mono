import { generateStarters } from "@/app/prompts/starters";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarDiscover } from "@/components/chat-action-bar-discover";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatQA } from "@/components/chat-qa";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { CollapsibleSection } from "@/components/collapsible-section";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { fetchPaper } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { Header4, ScrollArea, ScrollBar } from "@proemial/shadcn-ui";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
	params: { id: string };
	searchParams: { title?: string };
};

export default async function ReaderPage({ params }: Props) {
	const paper = await fetchPaper(params.id);

	if (!paper) {
		notFound();
	}

	const starters = paper.generated?.starters ?? (await generate(paper));

	const state = true ? "follow-up-discover" : "empty";

	const scrollToBottom = () => {
		console.log("scroll to bottom");
	};

	return (
		<div className="space-y-6">
			<CollapsibleSection
				trigger={
					<div className="flex items-center gap-4">
						<FileText className="size-4" />
						<Header4>Research Paper</Header4>
					</div>
				}
			>
				<div className="-mx-3">
					<ScrollArea className="w-full">
						<div className="flex space-x-3 w-max py-4 px-3">
							<PaperCardDiscover
								title={paper.data.title}
								date={paper.data.publication_date}
								publisher={"American Physical Society"}
							/>
							{paper.data.authorships.map((author) => (
								<PaperCardDiscoverProfile name={author.author.display_name} />
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</CollapsibleSection>

			<ChatArticle
				headline={paper.generated?.title}
				model="GPT-4 TURBO"
				type="Summary"
				text={paper.data.abstract}
			/>

			<ChatActionBarDiscover />

			<ChatQA />

			<ChatSuggestedFollowups suggestions={starters} />

			{/* {state !== "empty" && <ButtonScrollToBottom />} */}

			{/* <ChatPanel state={state} /> */}
		</div>
	);
}

async function generate(paper: OpenAlexPaper) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = await generateStarters(paperTitle, abstract);

		await Redis.papers.upsert(paper.id, (existingPaper) => {
			const generated = existingPaper.generated
				? { ...existingPaper.generated, starters }
				: { starters };

			return {
				...existingPaper,
				generated,
			};
		});

		return starters;
	}
	return [];
}
