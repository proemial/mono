import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { PaperReadsService } from "@/services/paper-reads-service";
import { PostService } from "@/services/post-service";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchArxivPaper } from "../../arxiv/[id]/fetch-arxiv-paper";
import { SourceProduct } from "@proemial/adapters/llm/models";
import dynamic from "next/dynamic";

const PaperReader = dynamic(() =>
	import("@/app/(pages)/(app)/paper/oa/[id]/paper-reader").then(
		(mod) => mod.PaperReader,
	),
);
type Props = {
	paperId: string;
	type: "oa" | "arxiv";
	collectionId?: string;
	source?: SourceProduct;
};

export default async function PaperPage({
	paperId,
	type,
	collectionId,
	source,
}: Props) {
	const fetchPaperFn = type === "oa" ? fetchPaper : fetchArxivPaper;
	const fetchedPaperPromise = fetchPaperFn(paperId).then((paper) => {
		if (!paper) {
			notFound();
		}
		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper, type === "oa" ? "oa" : "arxiv", source);
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

	const readers = await PaperReadsService.getReaders(paperId);

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				isBookmarked={isBookmarked}
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				paperPostsPromise={paperPostsPromise}
				type={type}
				collectionId={collectionId}
				readers={readers}
				source={source}
			/>
		</Suspense>
	);
}
