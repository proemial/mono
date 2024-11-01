import { Redis } from "@proemial/adapters/redis";
import { Header } from "./components/header";
import { NewsCard } from "./news-card";
import { Footer } from "./components/footer";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ErrorModal } from "./components/error-modal";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "proem - trustworthy perspectives",
	description:
		"Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.",
	openGraph: {
		images: ["/news/images/open-graph.png"],
	},
};

export default async function NewsPage({
	searchParams,
}: {
	searchParams: { error?: string };
}) {
	const unsorted = await Redis.news.list();
	const sorted = unsorted.sort(
		// -2, -1, "", "", 1, 2
		(a, b) =>
			(a.init?.sort ? a.init?.sort * 100 : 0) -
			(b.init?.sort ? b.init?.sort * 100 : 0),
	);
	const error = searchParams.error;

	return (
		<>
			<div className="flex flex-col items-start relative self-stretch w-full">
				{error && <ErrorModal error={error} />}
				<Header />

				<div className="flex flex-col">
					{sorted.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<a
								href={`/news/${encodeURIComponent(item.init?.url as string)}?p=1`}
								className="block mb-5"
							>
								<NewsCard url={item.init?.url as string} data={item} />
							</a>
						</Trackable>
					))}
				</div>
			</div>

			<Footer />
		</>
	);
}
