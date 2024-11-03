import { Redis } from "@proemial/adapters/redis";
import { NewsCard } from "./news-card";
import { Welcome } from "./components/welcome";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ErrorModal } from "./components/error-modal";
import { Metadata } from "next";
import { Header } from "./components/header";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

const title = "proem - trustworthy perspectives";
const description =
	"Proem takes any piece of online content an`d enriches it with scientific insights from the latest research papers.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: ["/news/images/open-graph.png"],
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
	const sorted = await getItems(searchParams.flush);
	const error = searchParams.error;

	return (
		<>
			<div className="flex flex-col items-start relative self-stretch w-full">
				{error && <ErrorModal error={error} />}
				<Header />
				<Welcome />

				<div className="flex flex-col">
					{sorted.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<a
								href={`/news/${encodeURIComponent(item.init?.url as string)}?p=1`}
								className="block mb-5 active:opacity-80"
							>
								<NewsCard
									url={item.init?.url as string}
									data={item}
									debug={searchParams.debug}
								/>
							</a>
						</Trackable>
					))}
				</div>
			</div>
		</>
	);
}

const cacheKey = "news-feed";

async function getItems(flush?: boolean) {
	if (flush) {
		console.log("Revalidating news-list");
		revalidateTag(cacheKey);
	}

	const items = await unstable_cache(
		async () => {
			console.log("Fetching items");
			const unsorted = (await Redis.news.list()).map((item) => ({
				init: item.init,
				scrape: {
					title: item.scrape?.title,
					date: item.scrape?.date,
					artworkUrl: item.scrape?.artworkUrl,
				},
				summarise: {
					questions: item.summarise?.questions,
				},
			}));

			return unsorted
				.map((item) => ({
					...item,
					date: dayjs(item.scrape?.date) ?? dayjs(),
				}))
				.sort((a, b) => b.date.diff(a.date))
				.sort(
					// -2, -1, "", "", 1, 2
					(a, b) =>
						(a.init?.sort ? a.init?.sort * 100 : 0) -
						(b.init?.sort ? b.init?.sort * 100 : 0),
				);
		},
		[cacheKey],
		{
			revalidate: 300, // 5 minutes
			tags: [cacheKey],
		},
	)();

	return items;
}
