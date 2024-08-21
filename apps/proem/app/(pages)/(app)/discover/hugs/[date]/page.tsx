import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { fetchPaperWithPosts } from "@/app/data/fetch-feed";
import { auth } from "@clerk/nextjs/server";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Metadata } from "next";
import Image from "next/image";
import { StaticFeed } from "../../andrej-karpathy-llm-reading-list/static-feed";
import { fetchReadingList } from "./fetch-list";
import logo from "./logo.svg";

export const dynamic = "force-static";

const title = "A hugging tribute to AK";
const description = "Daily papers from HuggingFace";

export const metadata: Metadata = {
	title,
	description,
	robots: {
		index: true,
		follow: false,
	},
};

type Props = {
	params: {
		date: string;
	};
};

export default async function HuggingList({ params: { date } }: Props) {
	const { userId } = await auth();
	const readingList = await fetchReadingList(date);
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];
	const paperIds = feed.map((paper) => paper.id);
	const papersWithPosts = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPosts(paperId, undefined)),
	);

	return (
		<div className="space-y-6">
			<StaticFeed
				feed={feed.map((paper) => ({
					...paper,
					posts:
						papersWithPosts.find((p) => p.paperId === paper.id)?.posts ?? [],
				}))}
				bookmarks={bookmarks}
			>
				<div className="flex items-center">
					A hugging tribute to AK
					<Image className="w-6 h-6 ml-2" src={logo} alt="" />
				</div>
			</StaticFeed>
		</div>
	);
}
