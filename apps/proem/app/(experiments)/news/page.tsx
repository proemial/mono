import { Button } from "@proemial/shadcn-ui";
import { NewsItem } from "./news-item";
import { QAItem } from "./qa-item";
import staticNewsItems from "./static-news-items.json";
import Link from "next/link";

export default async function NewsPage() {
	const items = staticNewsItems.sort((a, b) =>
		b.timestamp.localeCompare(a.timestamp),
	);

	return (
		<div className="h-full bg-theme-500 space-y-6 py-6">
			<div className="flex flex-col gap-4 max-w-xl mx-auto">
				{items.map((item) => (
					<NewsItem key={item.article.url} item={item}>
						<QAItem item={item} />
					</NewsItem>
				))}
			</div>
			<div className="flex justify-center">
				<Link href="/news/generate" target="_blank">
					<Button
						variant="black"
						className="min-w-[300px] bg-theme-800 hover:bg-theme-900"
					>
						Annotate your own news articles!
					</Button>
				</Link>
			</div>
		</div>
	);
}
