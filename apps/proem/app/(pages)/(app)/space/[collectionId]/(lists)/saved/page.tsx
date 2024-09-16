import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-paper-with-posts-and-readers";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { CollectionService } from "@/services/collection-service";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type SavedPageProps = CollectionIdParams;

export default async function SavedPage({
	params: { collectionId },
}: SavedPageProps) {
	const { userId, orgId } = auth();
	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		notFound();
	}
	const canEdit = PermissionUtils.canEditCollection(collection, userId, orgId);

	const bookmarkedPapers =
		await getBookmarkedPapersByCollectionId(collectionId);
	const bookmarkedPapersInCurrentSpace = bookmarkedPapers?.map(
		(paper) => paper.paperId,
	);

	if (
		!bookmarkedPapersInCurrentSpace ||
		bookmarkedPapersInCurrentSpace?.length === 0
	) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-sm">You have yet to save a paper…</div>
			</div>
		);
	}

	const papers = bookmarkedPapersInCurrentSpace
		? await Promise.all(
				bookmarkedPapersInCurrentSpace.map((paperId) => fetchPaper(paperId)),
			)
		: [];

	const papersWithPostsAndReaders = await Promise.all(
		bookmarkedPapersInCurrentSpace.map((paperId) =>
			fetchPaperWithPostsAndReaders(paperId, collection.id),
		),
	);

	const isDefaultSpace = collectionId === userId;
	const showThemeColors = isDefaultSpace;
	return (
		<div className="mb-8 space-y-3">
			{papers.map((paper) => {
				if (!paper) return null;
				const isBookmarked =
					bookmarkedPapersInCurrentSpace?.includes(paper.id) ?? false;
				const topics = paper.data.topics;
				const field = topics && getFieldFromOpenAlexTopics(topics);
				const item = (
					<FeedItem
						paper={{
							...paper,
							posts:
								papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
									?.posts ?? [],
							readers:
								papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
									?.readers ?? [],
						}}
						isBookmarked={isBookmarked}
						customCollectionId={collectionId}
						readonly={!canEdit}
					/>
				);

				if (showThemeColors && field?.theme) {
					return (
						<ThemeColoredCard theme={field.theme} key={paper.id}>
							{item}
						</ThemeColoredCard>
					);
				}
				return (
					<div
						className="border border-gray-200 hover:shadow-sm p-3.5 rounded-2xl"
						key={paper.id}
					>
						{item}
					</div>
				);
			})}
		</div>
	);
}
