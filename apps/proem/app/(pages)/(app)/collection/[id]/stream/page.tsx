import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeatures } from "@/app/data/fetch-feed";
import { auth } from "@clerk/nextjs";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import FeedItem from "../../../discover/feed-item";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function ({ params }: PageProps) {
	const { userId } = await auth();
	if (!params?.id) {
		notFound();
	}
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};

	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.slug, params.id),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});
	if (!collection) {
		notFound();
	}
	const paperIds = collection.collectionsToPapers.map((c) => c.paperId);

	if (paperIds.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-sm">
					Add at least one paper to this collection, to get a stream of related
					content.
				</div>
			</div>
		);
	}

	const fingerprints = await fetchFingerprints(paperIds);
	const { filter: features } = getFeatureFilter(fingerprints);
	const { rows } = await fetchFeedByFeatures(
		{ features, days: FEED_DEFAULT_DAYS },
		{ offset: 0 },
	);
	const papers = rows.map((row) => row.paper);

	return (
		<div className="space-y-8 my-8">
			{papers.map((paper) => (
				<FeedItem key={paper.id} paper={paper} bookmarks={bookmarks} />
			))}
		</div>
	);
}
