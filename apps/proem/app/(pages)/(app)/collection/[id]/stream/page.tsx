import { StreamList } from "@/app/(pages)/(app)/collection/[id]/stream/stream-list";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { notFound } from "next/navigation";
import { getCollectionPapersAndBookmarks } from "../collection-utils";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function StreamPage({ params }: PageProps) {
	const { userId } = auth();
	if (!params?.id || !userId) {
		notFound();
	}

	const { paperIds, bookmarks } = await getCollectionPapersAndBookmarks(
		userId,
		params.id,
	);

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
	return (
		<StreamList
			id={params.id}
			features={features}
			days={FEED_DEFAULT_DAYS}
			bookmarks={bookmarks}
		/>
	);
}
