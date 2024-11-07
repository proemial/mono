import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import { Metadata } from "next";
// import { revalidateTag, unstable_cache } from "next/cache";
import { NewsFeed } from "./components/scaffold";

const title = "proem - trustworthy perspectives";
const description =
	"Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: ["/news/images/open-graph.jpg"],
		title,
		description,
		siteName: title,
	},
};

export default async function NewsPage({
	searchParams,
}: {
	searchParams: { error?: string; debug?: boolean; flush?: boolean };
}) {
	const sorted = await await Redis.news.list(); //getItems(searchParams.flush);
	const serialized = JSON.parse(JSON.stringify(sorted)) as NewsAnnotatorSteps[];

	return (
		<NewsFeed
			sorted={serialized}
			error={searchParams.error}
			debug={searchParams.debug}
		/>
	);
}

// const cacheKey = "news-feed";
// const cacheDisabled = true;
// async function getItems(flush?: boolean) {
// 	if (flush || cacheDisabled || process.env.NODE_ENV === "development") {
// 		console.log("Revalidating news-list");
// 		revalidateTag(cacheKey);
// 	}

// 	const items = await unstable_cache(
// 		async () => {
// 			console.log("Fetching items");
// 			const unsorted = (await Redis.news.list())
// 				.map((item) => {
// 					if (!item?.init) {
// 						console.error("No init", item);

// 						return undefined;
// 					}
// 					return {
// 						init: item.init,
// 						scrape: {
// 							title: item.scrape?.title,
// 							date: item.scrape?.date,
// 							artworkUrl: item.scrape?.artworkUrl,
// 						},
// 						summarise: {
// 							questions: item.summarise?.questions,
// 						},
// 					};
// 				})
// 				.filter((item): item is NonNullable<typeof item> => item !== undefined);

// 			return unsorted;
// 		},
// 		[cacheKey],
// 		{
// 			revalidate: 30, // 30 seconds
// 			tags: [cacheKey],
// 		},
// 	)();

// 	return items;
// }
