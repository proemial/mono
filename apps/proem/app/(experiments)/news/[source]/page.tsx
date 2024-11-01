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

export const metadata: Metadata = {
	title: "proem - trustworthy perspectives",
	description:
		"Proem takes any piece of online content and enriches it with scientific insights from the latest research papers.",
};

export default async function UrlPage({ params, searchParams }: Props) {
	const decodedUrl =
		params.source === "annotate" && searchParams?.url
			? decodeURIComponent(searchParams.url)
			: decodeURIComponent(params.source);

	const item = await Redis.news.get(decodedUrl);
	return <Scaffold url={decodedUrl} data={item} />;
}
