import { Feed } from "@/app/(pages)/(app)/discover/feed";
import FeedItem from "@/app/(pages)/(app)/discover/feed-item";
import { fetchLatestPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { Loading01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function DiscoverPage() {
	const fetchedPapersPromise = fetchLatestPapers();

	return (
		<div className="space-y-6">
			<Suspense fallback={<Loading01 />}>
				<Feed fetchedPapersPromise={fetchedPapersPromise} />
			</Suspense>
		</div>
	);
}
