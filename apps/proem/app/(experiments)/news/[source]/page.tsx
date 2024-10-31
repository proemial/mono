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

export default async function UrlPage({ params, searchParams }: Props) {
	const decodedUrl =
		params.source === "annotate" && searchParams?.url
			? decodeURIComponent(searchParams.url)
			: decodeURIComponent(params.source);

	const item = await Redis.news2.get(decodedUrl);
	return <Scaffold url={decodedUrl} data={item} />;
}
