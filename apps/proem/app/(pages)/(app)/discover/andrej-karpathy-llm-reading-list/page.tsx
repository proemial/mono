import { fetchReadingList } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/fetch-list";
import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Metadata } from "next";

export const dynamic = "force-static";

const title = "Andrej Karpathy's LLM Reading List";
const url = "https://proem.ai/discover/andrej-karpathy-llm-reading-list";
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
	const readingList = await fetchReadingList();
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];

	return (
		<div className="space-y-6">
			<StaticFeed feed={feed}>Andrej Karpathy's LLM Reading List</StaticFeed>
		</div>
	);
}
