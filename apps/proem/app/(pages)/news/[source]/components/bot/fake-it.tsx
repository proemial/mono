import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { User, users } from "@/app/(pages)/news/components/users";
import { CommunityHeader } from "./headers";
import { BotQa } from "./bot-qa";
import { useEffect, useState } from "react";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

export function CommunityQuestions({
	url,
	questions,
	isFromFeed,
	papers,
	activeColors,
}: {
	url: string;
	papers?: ReferencedPaper[];
	questions?: Array<[string, string]>;
	isFromFeed?: boolean;
	activeColors?: { foreground?: string; background?: string };
}) {
	const rndUser = useRandomUser(url);
	const questionsToShow = useQuestions(questions);

	if (!isFromFeed) return <></>;

	return (
		<div className="flex flex-col mt-3">
			<CommunityHeader />
			<div className="flex relative flex-col-reverse items-start self-stretch w-full">
				{questionsToShow?.map((question, index) => {
					return (
						<BotQa
							key={index}
							user={
								index < 6 && isFromFeed
									? users.at(Math.floor(rndUser + index / 2))
									: undefined
							}
							question={question[0]}
							answer={question[1]}
							papers={papers}
							activeColors={activeColors}
						/>
					);
				})}
			</div>

			<DummyButton url={url} />
		</div>
	);
}

export function DummyButton({ url }: { url: string }) {
	return (
		<div className="flex justify-center items-center w-full text-center">
			<Trackable
				trackingKey={analyticsKeys.experiments.news.item.qa.clickShowMore}
				properties={{ sourceUrl: url }}
			>
				<div className="hover:cursor-pointer hover:bg-gray-100 flex px-3 py-2 my-4 rounded-full border">
					<div className="flex gap-1.5">
						<div className="text-sm select-none">Show more</div>
					</div>
				</div>
			</Trackable>
		</div>
	);
}

function useRandomUser(url: string) {
	const [user, setUser] = useState(0);

	useEffect(() => {
		setUser(getSeed(url, users));
	}, [url]);

	return user;
}
function useQuestions(allQuestions?: Array<[string, string]>) {
	const [questions, setQuestions] = useState<Array<[string, string]>>([]);

	useEffect(() => {
		setQuestions(allQuestions?.slice(0, 3) ?? []);
	}, [allQuestions]);

	return questions;
}

function getSeed(title: string, users: User[]) {
	// Create a consistent hash from the title
	let hash = 0;
	for (let i = 0; i < title.length; i++) {
		hash = (hash << 5) - hash + title.charCodeAt(i);
		hash = hash & hash; // Convert to 32-bit integer
	}
	// return random-looking but consistent user number
	return Math.abs(hash % (users.length - 3));
}

export function useStreamer(text?: string) {
	const [streamedText, setStreamedText] = useState<string>();

	useEffect(() => {
		if (!text) return;

		let currentLength = 0;
		const updateText = () => {
			if (currentLength >= text.length) {
				clearInterval(interval);
				return;
			}

			currentLength += 10; // Add 10 characters at a time
			setStreamedText(text.slice(0, currentLength));

			// Set a new random interval for the next update
			const newInterval = Math.floor(Math.random() * 120);
			clearInterval(interval);
			interval = setInterval(updateText, newInterval);
		};
		let interval = setInterval(updateText, Math.floor(Math.random() * 120));

		return () => clearInterval(interval);
	}, [text]);

	return streamedText;
}
