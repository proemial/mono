import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { unstable_cache } from "next/cache";
import { Feed } from "./feed";

export const defaultFeedFilter = {
	features: [],
	days: FEED_DEFAULT_DAYS,
	titles: undefined,
};

export module CachedFeed {
	export const fromPublic = (offset: number) => {
		return fetchFeedByFeaturesWithPostsAndReaders(
			{
				features: defaultFeedFilter.features,
				days: defaultFeedFilter.days,
			},
			{ offset },
			false,
			undefined,
		);
	};

	export const fromCollection = (
		...args: Parameters<typeof Feed.fromCollection>
	) =>
		unstable_cache(
			async () => {
				const feed = await Feed.fromCollection(...args);
				console.log("feed", feed);
				console.log([
					args[0],
					String(args[1].offset),
					args[2] ?? "anonymous",
					args[3] ?? "-",
				]);
				return feed;
			},
			[args[0], String(args[1].offset), args[2] ?? "anonymous", args[3] ?? "-"],
			{
				revalidate: false,
			},
		)();
}
