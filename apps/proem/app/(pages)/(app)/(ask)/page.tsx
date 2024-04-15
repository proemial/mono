import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatQuestion } from "@/components/chat-question";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { CollapsibleSection } from "@/components/collapsible-section";
import { PaperCardAsk } from "@/components/paper-card-ask";
import { ChatAnswerSkeleton } from "@/components/skeletons";
import { Header4, ScrollArea, ScrollBar } from "@proemial/shadcn-ui";
import { FileText } from "lucide-react";

const dummyAnswer = {
	type: "Answer",
	model: "GPT-4-TURBO",
	text: "The statistical interpretation of quantum theory focuses on ensemble descriptions and hidden variables. The main purpose is to explain quantum phenomena statistically. Furthermore, a method for calculating wave functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Wave Functions in Crystals In quantum theory, statistical interpretations clarify quantum phenomena through ensembles and hidden variables. Additionally, a proposed method calculates wave functions effectively in crystals.",
};

const dummyPapers = [
	{
		id: "1",
		title: "The Role of the Brain in the Evolution of the Human Hand",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "2",
		title: "The Statistical Interpretation of Quantum Mechanics",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "3",
		title: "Calculating Wave Functions in Crystals",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "4",
		title: "The Role of the Brain in the Evolution of the Human Hand",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "5",
		title: "The Statistical Interpretation of Quantum Mechanics",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
	{
		id: "6",
		title: "Calculating Wave Functions in Crystals",
		date: "2021.10.10",
		publisher: "American Physical Society",
		type: "www",
	},
];

type AskPageProps = {
	searchParams?: {
		query?: string;
	};
};

export default function AskPage({ searchParams }: AskPageProps) {
	const query = searchParams?.query || "";

	const state = searchParams?.query ? "follow-up-ask" : "empty";
	const loading = true;

	const headers = {
		loading: "Research papers found",
		loaded: "Research papers interrogated",
	};

	const scrollToBottom = () => {
		console.log("scroll to bottom");
	};

	return (
		<div className="space-y-6">
			<ChatQuestion question={"question"} />

			<CollapsibleSection
				trigger={
					<div className="flex items-center gap-4">
						<FileText className="size-4" />
						<Header4>{loading ? headers.loading : headers.loaded}</Header4>
					</div>
				}
				extra={dummyPapers.length}
			>
				<ScrollArea className="w-full pb-4 rounded-md whitespace-nowrap">
					<div className="flex space-x-3 w-max">
						{dummyPapers.map((paper, i) => (
							<PaperCardAsk paper={paper} key={i} index={`${i + 1}`} />
						))}

						<PaperCardAsk
							key={dummyPapers.length}
							index={`${dummyPapers.length + 1}`}
						/>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CollapsibleSection>

			<ChatAnswerSkeleton />

			<ChatArticle
				headline="headline?"
				type={dummyAnswer.type}
				model={dummyAnswer.model}
				text={dummyAnswer.type}
			/>

			<ChatActionBarAsk />
			<ChatSuggestedFollowups suggestions={["Ask follow-up..."]} />

			{state !== "empty" && <ButtonScrollToBottom />}
			{/* <ChatPanel state={state} /> */}
		</div>
	);
}
