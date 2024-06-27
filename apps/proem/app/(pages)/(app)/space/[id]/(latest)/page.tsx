import { getBookmarksByUserId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { StreamList } from "@/app/(pages)/(app)/space/[id]/(latest)/stream-list";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { notFound } from "next/navigation";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function LatestPage({ params }: PageProps) {
	const { userId } = auth();
	if (!params?.id || !userId) {
		notFound();
	}

	const [bookmarks] = await Promise.all([getBookmarksByUserId(userId)]);

	const history = await getBookmarksAndHistory(userId);
	const fingerprints = await fetchFingerprints(...history);
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
