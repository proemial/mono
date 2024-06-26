import { getBookmarksByUserId } from "@/app/(pages)/(app)/(discover)/get-bookmarks-by-user-id";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import FeedItem from "../../../(discover)/feed-item";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";
import { getPaperIdsForCollection } from "../collection-utils";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function CollectionPage({ params }: PageProps) {
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
					There are no papers in this collection yet.
				</div>
			</div>
		);
	}

	const papers = paperIds
		? await Promise.all(paperIds.map((paperId) => fetchPaper(paperId)))
		: [];

	return (
		<div className="space-y-8 mb-8">
			{papers.map(
				(paper) =>
					paper && (
						<FeedItem key={paper.id} paper={paper} bookmarks={bookmarks} />
					),
			)}
		</div>
	);
}
