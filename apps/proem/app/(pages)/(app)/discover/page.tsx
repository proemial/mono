import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { fetchLatestPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { OaTopics } from "@proemial/models/open-alex-topics";
import { Loading01 } from "@untitled-ui/icons-react";
import { Suspense } from "react";

type Params = {
	searchParams?: { topic?: string };
};

export default async function DiscoverPage({ searchParams }: Params) {
	const topicId = OaTopics.find(
		(c) =>
			c.display_name.toLowerCase() ===
			decodeURI(searchParams?.topic || "").replaceAll("%2C", ","),
	)?.id;

	const fetchedPapersPromise = fetchLatestPapers(topicId);

	return (
		<div className="space-y-6">
			<Suspense fallback={<Loading01 />}>
				<Feed fetchedPapersPromise={fetchedPapersPromise} />
			</Suspense>
		</div>
	);
}
