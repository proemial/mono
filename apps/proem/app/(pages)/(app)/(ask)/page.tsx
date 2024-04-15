import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatPapersAsk } from "@/components/chat-papers-ask";
import { ChatQuestion } from "@/components/chat-question";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { ChatAnswerSkeleton } from "@/components/skeletons";
import { Suspense } from "react";

const dummyAnswer = {
	type: "Answer",
	model: "GPT-4-TURBO",
	text: "The statistical interpretation of quantum theory focuses on ensemble descriptions and hidden variables. The main purpose is to explain quantum phenomena statistically. Furthermore, a method for calculating wave functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Wave Functions in Crystals In quantum theory, statistical interpretations clarify quantum phenomena through ensembles and hidden variables. Additionally, a proposed method calculates wave functions effectively in crystals.",
};
export default function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
	};
}) {
	const query = searchParams?.query || "";

	const state = searchParams?.query ? "follow-up-ask" : "empty";

	const scrollToBottom = () => {
		console.log("scroll to bottom");
	};

	return (
		<main className="flex w-full">
			<div className="flex flex-col w-full gap-6 p-4">
				{query && <ChatQuestion question={query} />}
				{query && <ChatPapersAsk loading={false} />}
				{query && (
					<Suspense key={query} fallback={<ChatAnswerSkeleton />}>
						{/* <ChatArticle article={dummyAnswer} /> */}
					</Suspense>
				)}
				{query && (
					<>
						<ChatActionBarAsk />
						{/* <ChatSuggestedFollowups label="Ask follow-up..." /> */}
					</>
				)}
				{state !== "empty" && <ButtonScrollToBottom />}
				<ChatPanel state={state} />
			</div>
		</main>
	);
}
