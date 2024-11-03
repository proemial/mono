import { Metadata } from "next";
import { Scaffold } from "./components/scaffold";
import { Redis } from "@proemial/adapters/redis";
import { revalidateTag, unstable_cache } from "next/cache";

type Props = {
	params: {
		source: string;
	};
	searchParams: {
		url?: string;
		flush?: boolean;
	};
};

// Max out the duration to allow for long running tasks
export const maxDuration = 60;

export async function generateMetadata(props: Props) {
	const { item } = await fetchItem(props);

	const title = item?.scrape?.title
		? `${item?.scrape?.title} | proem`
		: "proem - trustworthy perspectives";
	const description =
		"Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			siteName: title,
		},
	};
}

export default async function UrlPage(props: Props) {
	const { item, url } = await fetchItem(props);
	return <Scaffold url={url} data={item} />;
}

const cacheKey = "news-item";

async function fetchItem({ params, searchParams }: Props) {
	const url =
		params.source === "annotate" && searchParams?.url
			? decodeURIComponent(searchParams.url)
			: decodeURIComponent(params.source);

	if (searchParams.flush) {
		console.log("Revalidating news-item");
		revalidateTag(cacheKey);
	}

	const item = await unstable_cache(
		async () => {
			console.log("Fetching item");
			return await Redis.news.get(url);
		},
		[cacheKey],
		{
			revalidate: 300, // 5 minutes
			tags: [cacheKey],
		},
	)();

	return { url, item };
}
