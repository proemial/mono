import { generateStarters } from "@/app/prompts/starters";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarDiscover } from "@/components/chat-action-bar-discover";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatPapersDiscover } from "@/components/chat-papers-discover";
import { ChatQA } from "@/components/chat-qa";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { fetchPaper } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { notFound } from "next/navigation";

type Props = {
	params: { id: string };
	searchParams: { title?: string };
};

export default async function Page({ params }: Props) {
	const paper = await fetchPaper(params.id);

	if (!paper) {
		notFound();
	}

	const { title, abstract } = paper.data;

	const starters = paper?.generated?.starters
		? paper?.generated?.starters
		: await generate(paper);

	const state = true ? "follow-up-discover" : "empty";

	const scrollToBottom = () => {
		console.log("scroll to bottom");
	};

	return (
		<main className="flex w-full">
			<div className="flex flex-col w-full gap-6 p-4 pb-0">
				<ChatPapersDiscover />

				{/* {query && (
					<Suspense key={query}> */}
				<ChatArticle
					headline={title}
					model="GPT-4 TURBO"
					type="Summary"
					text={abstract}
				/>
				{/* </Suspense>
				)} */}

				<ChatActionBarDiscover />
				<ChatQA />
				<ChatSuggestedFollowups suggestions={starters} />

				{state !== "empty" && <ButtonScrollToBottom />}

				<ChatPanel state={state} />
			</div>
		</main>
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
