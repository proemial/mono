import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { fetchLatestPapers } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { Loading01 } from "@untitled-ui/icons-react";
import { Suspense } from "react";

type Params = {
	searchParams?: { filter?: string };
};

export default async function DiscoverPage({ searchParams }: Params) {
	const fetchedPapersPromise = fetchLatestPapers(
		undefined,
		searchParams?.filter?.replaceAll("%3A", ":"),
	);

	return (
		<div className="space-y-6">
			<Suspense fallback={<Loading01 />}>
				<Feed fetchedPapersPromise={fetchedPapersPromise} treeFilter />
			</Suspense>
		</div>
	);
}
