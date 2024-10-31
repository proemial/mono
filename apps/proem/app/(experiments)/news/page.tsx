import { Redis } from "@proemial/adapters/redis";
import { Header } from "./components/header";
import { NewsCard } from "./news-card";
import { Footer } from "./components/footer";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

export default async function NewsPage() {
	const items = await Redis.news.list();

	return (
		<>
			<div className="flex flex-col items-start relative self-stretch w-full">
				<Header />

				<div className="flex flex-col">
					{items.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<a
								href={`/news/${encodeURIComponent(item.init?.url as string)}`}
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
