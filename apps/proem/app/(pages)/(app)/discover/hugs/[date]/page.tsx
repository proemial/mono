import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { auth } from "@clerk/nextjs";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Metadata } from "next";
import Image from "next/image";
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
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];

	return (
		<>
			<NavBarV2 action={<OpenSearchAction />}>
				<div className="truncate">A hugging tribute to AK</div>
			</NavBarV2>
			<Main>
				<div className="space-y-6">
					<StaticFeed feed={feed} bookmarks={bookmarks}>
						<div className="flex items-center">
							A hugging tribute to AK
							<Image className="ml-2 w-6 h-6" src={logo} alt="" />
						</div>
					</StaticFeed>
				</div>
			</Main>
		</>
	);
}
