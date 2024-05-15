import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Metadata } from "next";
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
	const readingList = await fetchReadingList(date);
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];

	return (
		<div className="space-y-6">
			<StaticFeed title="A hugging tribute to AK" feed={feed} />
		</div>
	);
}
