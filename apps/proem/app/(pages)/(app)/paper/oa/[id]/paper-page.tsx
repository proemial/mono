import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { PostService } from "@/services/post-service";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchArxivPaper } from "../../arxiv/[id]/fetch-arxiv-paper";

type Props = {
	paperId: string;
	type: "oa" | "arxiv";
	collectionId?: string;
};

export default async function PaperPage({
	paperId,
	type,
	collectionId,
}: Props) {
	const fetchPaperFn = type === "oa" ? fetchPaper : fetchArxivPaper;
	const fetchedPaperPromise = fetchPaperFn(paperId).then((paper) => {
		if (!paper) {
			notFound();
		}
		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper, type === "oa" ? "oa" : "arxiv");
	});
	const paperPostsPromise = PostService.getPostsWithCommentsAndAuthors(
		collectionId,
		paperId,
	);

	const { userId } = auth();
	const bookmarks = userId
		? await getBookmarksByCollectionId(collectionId ?? userId)
		: {};
	const isBookmarked = Boolean(bookmarks[paperId]);

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				isBookmarked={isBookmarked}
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				paperPostsPromise={paperPostsPromise}
				type={type}
				collectionId={collectionId}
			/>
		</Suspense>
	);
}
