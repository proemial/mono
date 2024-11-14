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
		<div className="flex flex-col gap-3">
			<CommunityHeader />
			<div className="flex flex-col-reverse items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
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
							id={`qa-${index}`}
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
		<div className="flex text-center items-center w-full justify-center">
			<Trackable
				trackingKey={analyticsKeys.experiments.news.item.qa.clickShowMore}
				properties={{ sourceUrl: url }}
			>
				<div className="inline-flex h-8 gap-1 px-3 py-2 rounded-[19px] border border-solid active:bg-theme-600 hover:cursor-pointer">
					<div className="inline-flex gap-1.5 relative">
						<div className="relative w-fit mt-[-1.00px] font-normal text-[13px] tracking-[0] leading-[normal] select-none">
							Show more
						</div>
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
