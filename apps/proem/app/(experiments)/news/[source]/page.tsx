import { Scaffold } from "./components/scaffold";
import NewsAnnotator from "./annotator";
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

export default async function UrlPage({ params, searchParams }: Props) {
	const decodedUrl =
		params.source !== "annotate"
			? decodeURIComponent(params.source)
			: searchParams?.url
				? decodeURIComponent(searchParams.url)
				: undefined;
	const item = decodedUrl && (await Redis.news.get(decodedUrl));

	if (item) {
		return <Scaffold data={item} />;
	}

	return <NewsAnnotator url={decodedUrl} />;
}
