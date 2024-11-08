import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import { Metadata } from "next";
import { NewsFeed } from "./components/news-feed";
import { getItems } from "./cached-items";

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
	const items = await getItems(searchParams.flush);
	const serialized = JSON.parse(JSON.stringify(items)) as NewsAnnotatorSteps[];

	return (
		<NewsFeed
			sorted={serialized}
			error={searchParams.error}
			debug={searchParams.debug}
		/>
	);
}
