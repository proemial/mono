import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { auth } from "@clerk/nextjs";
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

	return (
		<>
			<NavBar action={<OpenSearchAction />}>
				<div className="truncate">A hugging tribute to AK</div>
			</NavBar>
			<Main>
				<div className="space-y-6">
					<StaticFeed feed={feed} bookmarks={bookmarks}>
						<div className="flex items-center">
							A hugging tribute to AK
							<Image className="w-6 h-6 ml-2" src={logo} alt="" />
						</div>
					</StaticFeed>
				</div>
			</Main>
		</>
	);
}
