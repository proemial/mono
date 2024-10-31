import { Redis } from "@proemial/adapters/redis";
import { Header } from "./components/header";
import { NewsCard } from "./news-card";
import { Footer } from "./components/footer";

export default async function NewsPage() {
	const items = await Redis.news2.list();

	return (
		<>
			<div className="flex flex-col items-start relative self-stretch w-full">
				<Header />

				<div className="flex flex-col">
					{items.map((item, i) => (
						<a
							key={i}
							href={`/news/${encodeURIComponent(item.init?.url as string)}`}
							className="block mb-5"
						>
							<NewsCard data={item} />
						</a>
					))}
				</div>
			</div>

			<Footer />
		</>
	);
}
