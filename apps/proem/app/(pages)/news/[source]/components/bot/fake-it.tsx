import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { User } from "@/app/(pages)/news/components/users";
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

export function DummyButton({
	isFromFeed,
	url,
}: {
	isFromFeed: boolean;
	url: string;
}) {
	return (
		<>
			{isFromFeed && (
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
			)}
		</>
	);
}
