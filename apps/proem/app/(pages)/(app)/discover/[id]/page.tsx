import { generateStarters } from "@/app/prompts/starters";
import { ChatArticle } from "@/components/chat-article";
import { ChatQA } from "@/components/chat-qa";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { PaperCardDiscover } from "@/components/paper-card-discover";
import { PaperCardDiscoverProfile } from "@/components/paper-card-discover-profile";
import { fetchPaper } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";
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
						<File02 className="size-4" />
						<Header4>Research Paper</Header4>
					</div>
				}
			>
				<HorisontalScrollArea>
					<a
						href={paper.data.primary_location.landing_page_url}
						target="_blank"
						rel="noreferrer"
					>
						<PaperCardDiscover
							title={paper.data.title}
							date={paper.data.publication_date}
							publisher={paper.data.primary_location.source?.display_name ?? ""}
						/>
					</a>
					{paper.data.authorships.map((author) => (
						<PaperCardDiscoverProfile name={author.author.display_name} />
					))}
				</HorisontalScrollArea>
			</CollapsibleSection>

			<ChatArticle
				headline={paper.generated?.title}
				model="GPT-4 TURBO"
				type="Summary"
				text={paper.data.abstract}
			/>

			{/* <ChatActionBarDiscover /> */}

			<ChatQA />

			<ChatSuggestedFollowups suggestions={starters} />
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
