import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { StreamList } from "@/app/(pages)/(app)/space/[id]/stream/stream-list";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { notFound } from "next/navigation";
import { getPaperIdsForCollection } from "../collection-utils";

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

	const [paperIds, bookmarks] = await Promise.all([
		getPaperIdsForCollection(params.id),
		getBookmarksByUserId(userId),
	]);

	if (paperIds?.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-sm">
					Save at least one paper, to access the latest related content.
				</div>
			</div>
		);
	}

	const fingerprints = paperIds ? await fetchFingerprints(paperIds) : [];
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
