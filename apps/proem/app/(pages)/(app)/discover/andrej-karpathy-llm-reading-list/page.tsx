import { fetchReadingList } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/fetch-list";
import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-feed";
import { auth } from "@clerk/nextjs/server";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Metadata } from "next";

const title = "Andrej Karpathy's LLM Reading List";
const url = "https://proem.ai/space/andrej-karpathy-llm-reading-list";
const description =
	"All the papers from Andrej Karpathy's Intro to Large Language Models video.";

export const metadata: Metadata = {
	title,
	description,
	robots: {
		index: true,
		follow: false,
	},
};

export default async function AndrejKarpathyLLMReadingList() {
	const { userId } = await auth();
	const readingList = await fetchReadingList();
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];
	const paperIds = feed.map((paper) => paper.id);
	const papersWithPostsAndReaders = await Promise.all(
		paperIds.map((paperId) =>
			fetchPaperWithPostsAndReaders(paperId, undefined),
		),
	);

	return (
		<div className="space-y-6">
			<StaticFeed
				feed={feed.map((paper) => ({
					...paper,
					posts:
						papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
							?.posts ?? [],
					readers:
						papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
							?.readers ?? [],
				}))}
				bookmarks={bookmarks}
			>
				Andrej Karpathy's LLM Reading List
			</StaticFeed>
		</div>
	);
}
