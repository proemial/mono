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

	const title = item?.scrape?.title;
	const description = item?.summarise?.commentary;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			siteName: "proem - trustworthy perspectives",
		},
	};
}

export default async function UrlPage(props: Props) {
	const { item, url } = await fetchItem(props);
	return <Scaffold url={url} data={item} />;
}

async function fetchItem({ params, searchParams }: Props) {
	const url =
		params.source === "annotate" && searchParams?.url
			? decodeURIComponent(searchParams.url)
			: decodeURIComponent(params.source);

	const cacheKey = `news:${url}`;
	if (searchParams.flush) {
		console.log("Revalidating news-item");
		revalidateTag(url);
	}

	const item = await unstable_cache(
		async () => {
			console.log("Fetching item");
			return await Redis.news.get(url);
		},
		[cacheKey],
		{
			revalidate: 300, // 5 minutes
			tags: ["news-item", cacheKey],
		},
	)();

	return { url, item };
}
