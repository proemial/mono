import { Redis } from "@proemial/adapters/redis";
import { Header } from "./components/header";
import { NewsCard } from "./news-card";
import { Footer } from "./components/footer";

export default async function NewsPage() {
	const items = (await Redis.news.list()).filter((item) => !!item._?.public);

	return (
		<>
			<div className="flex flex-col items-start gap-3 relative self-stretch w-full">
				<Header />

				<div className="flex flex-col gap-4">
					{items.map((item, i) => (
						<NewsCard key={i} data={item} />
					))}
				</div>
			</div>

			<Footer />
		</>
	);
}
