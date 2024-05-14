import { fetchReadingList } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/fetch-list";
import { StaticFeed } from "@/app/(pages)/(app)/discover/andrej-karpathy-llm-reading-list/static-feed";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export const dynamic = "force-static";

export default async function AndrejKarpathyLLMReadingList() {
	const readingList = await fetchReadingList();
	const feed = readingList.rows.filter(Boolean) as OpenAlexPaper[];

	return (
		<div className="space-y-6">
			<StaticFeed feed={feed} />
		</div>
	);
}
