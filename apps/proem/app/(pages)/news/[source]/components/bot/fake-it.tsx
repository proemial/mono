import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { User, users } from "@/app/(pages)/news/components/users";
import { CommunityHeader } from "./headers";
import { BotQa } from "./bot-qa";

export function CommunityQuestions({
	url,
	questions,
	isFromFeed,
}: {
	url: string;
	questions?: Array<[string, string]>;
	isFromFeed?: boolean;
}) {
	if (!isFromFeed) return <></>;

	const questionsToShow = questions?.slice(0, 3);
	const rndUser = getRandomUserSeed(url, users);

	return (
		<div className="flex flex-col gap-3 mt-3">
			<CommunityHeader />
			<div className="flex relative flex-col-reverse gap-4 items-start self-stretch w-full">
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

export function getRandomUserSeed(title: string, users: User[]) {
	// Create a consistent hash from the title
	let hash = 0;
	for (let i = 0; i < title.length; i++) {
		hash = (hash << 5) - hash + title.charCodeAt(i);
		hash = hash & hash; // Convert to 32-bit integer
	}
	// return random-looking but consistent user number
	return Math.abs(hash % (users.length - 3));
}
