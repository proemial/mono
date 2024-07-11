import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { auth } from "@clerk/nextjs";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Metadata } from "next";
import { getPaperIdsWithPosts } from "../../paper/paper-post-utils";
import { fetchReadingList } from "./fetch-list";
import { StaticFeed } from "./static-feed";

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
	const papersWithPosts = await getPaperIdsWithPosts(paperIds, undefined);

	return (
		<>
			<NavBar action={<OpenSearchAction />}>
				<div className="truncate">Andrej Karpathy's LLM Reading List</div>
			</NavBar>
			<Main>
				<div className="space-y-6">
					<StaticFeed
						feed={feed.map((paper) => ({
							...paper,
							posts:
								papersWithPosts.find((p) => p.id === paper.id)?.posts ?? [],
						}))}
						bookmarks={bookmarks}
					>
						Andrej Karpathy's LLM Reading List
					</StaticFeed>
				</div>
			</Main>
		</>
	);
}
