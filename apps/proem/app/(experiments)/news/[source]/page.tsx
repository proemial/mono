import { Metadata } from "next";
import { Scaffold } from "./components/scaffold";
import { Redis } from "@proemial/adapters/redis";

type Props = {
	params: {
		source: string;
	};
	searchParams: {
		rebuild?: boolean;
		url?: string;
	};
};

// Max out the duration to allow for long running tasks
export const maxDuration = 60;

export async function generateMetadata(props: Props) {
	const { item } = await fetchItem(props);

	return {
		title: item?.scrape?.title
			? `${item?.scrape?.title} | proem`
			: "proem - trustworthy perspectives",
		description:
			"Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.",
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

	const item = await Redis.news.get(url);

	return { url, item };
}
