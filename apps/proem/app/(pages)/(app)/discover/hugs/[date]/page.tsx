import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Metadata } from "next";
import { fetchReadingList } from "./fetch-list";
import logo from "./logo.svg";
import Image from "next/image";

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
	const readingList = await fetchReadingList(date);
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];

	return (
		<div className="space-y-6">
			<StaticFeed feed={feed}>
				<div className="flex items-center">
					A hugging tribute to AK
					<Image className="ml-2 w-6 h-6" src={logo} alt="" />
				</div>
			</StaticFeed>
		</div>
	);
}
