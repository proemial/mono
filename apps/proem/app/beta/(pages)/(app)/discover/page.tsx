import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarDiscover } from "@/components/chat-action-bar-discover";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatPapersDiscover } from "@/components/chat-papers-discover";
import { ChatQA } from "@/components/chat-qa";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { Suspense } from "react";

const dummySummary = {
	type: "Summary",
	model: "GPT-4-TURBO",
	headline:
		"Quantum theory may involve hidden variables but proving them logically consistent creates challenges in separated systems",
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

	const state = searchParams?.query ? "follow-up-discover" : "empty";

	const scrollToBottom = () => {
		console.log("scroll to bottom");
	};

	return (
		<main className="flex w-full">
			<div className="flex flex-col w-full gap-6 p-4 pb-0">
				<h1>2</h1>
				{query && <ChatPapersDiscover />}
				{query && (
					<Suspense key={query}>
						<ChatArticle article={dummySummary} />
					</Suspense>
				)}
				{query && (
					<>
						{/* <ChatActionBarDiscover /> */}
						{/* <ChatQA /> */}
						{/* <ChatSuggestedFollowups label="Ask this paper..." /> */}
						<h1>asdf</h1>
					</>
				)}
				{state !== "empty" && <ButtonScrollToBottom />}
				<ChatPanel state={state} />
			</div>
		</main>
	);
}
