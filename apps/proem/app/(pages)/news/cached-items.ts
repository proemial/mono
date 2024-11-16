import { Redis } from "@proemial/adapters/redis";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";

const cacheKey = "news-feed";
const cacheDisabled = false;

export async function getItems(flush?: boolean) {
	if (flush || cacheDisabled || process.env.NODE_ENV === "development") {
		console.log("Revalidating news-list");
		revalidateTag(cacheKey);
	}

	const items = await unstable_cache(
		async () => {
			console.log("Fetching items");
			const unsorted = (await Redis.news.list())
				.map((item) => {
					if (!item?.init) {
						console.error("No init", item);

						return undefined;
					}
					return {
						init: item.init,
						scrape: {
							title: item.scrape?.title,
							date: item.scrape?.date,
							artworkUrl: item.scrape?.artworkUrl,
						},
						summarise: {
							questions: item.summarise?.questions,
							engTitle: item.summarise?.engTitle,
						},
					};
				})
				.filter((item): item is NonNullable<typeof item> => item !== undefined);

			return unsorted;
		},
		[cacheKey],
		{
			revalidate: 3600, // 1 hour
			tags: [cacheKey],
		},
	)();

	return items;
}
