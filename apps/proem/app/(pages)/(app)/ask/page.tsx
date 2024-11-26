import { ChatInput } from "./components/chat-input";
import { ProemLogo } from "@/components/icons/brand/logo";
import { MoodSelector } from "./components/mood-selector";
import { Suggestions } from "./components/suggestions";
import { Metadata } from "next";
import { getItems } from "../../news/cached-items";
import { STARTERS } from "./starters";

export const metadata: Metadata = {
	robots: {
		index: true,
		follow: true,
	},
};

export default async function AskPage() {
	const starters = await getStarters();

	return (
		<div className="flex flex-col justify-between flex-grow gap-4">
			<div className="flex flex-col items-center justify-center flex-grow gap-6">
				<ProemLogo size="md" />
				<div className="text-xl text-center">
					<div>Answers based on Scientific</div>
					<div>Research</div>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-2">
					<div className="flex justify-end -mr-2">
						<MoodSelector trackingPrefix="ask" />
					</div>
					<Suggestions suggestions={starters} type="starter" />
				</div>
			</div>
			<div>
				<ChatInput placeholder="Ask a question" trackingPrefix="ask" />
			</div>
		</div>
	);
}

/**
 * Use random news item questions as starters.
 */
const getStarters = async () => {
	const newsItems = await getItems();
	const fallbackStarters = STARTERS;

	const uniqueRandomIndices = new Set<number>();
	while (uniqueRandomIndices.size < 3) {
		uniqueRandomIndices.add(Math.floor(Math.random() * newsItems.length));
	}
	const noOfQuestionsPerItem = 6;
	const questionIndex = Math.floor(Math.random() * noOfQuestionsPerItem);
	const newsStarters = Array.from(uniqueRandomIndices).map((index) => {
		const question =
			newsItems[index]?.summarise?.questions?.[questionIndex]?.question;
		const randomFallback = fallbackStarters[
			Math.floor(Math.random() * fallbackStarters.length)
		] as string;
		if (!question || containsAnaphors(question)) {
			return randomFallback;
		}
		return question;
	});

	return newsStarters;
};

const containsAnaphors = (text: string) => {
	const anaphors = [
		" this ",
		" that ",
		" these ",
		" those ",
		" he ",
		" she ",
		" it ",
		" they",
	];
	return anaphors.some((anaphor) => text.toLowerCase().includes(anaphor));
};
