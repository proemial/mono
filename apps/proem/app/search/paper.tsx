"use server";
import { fetchPaper } from "../(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "../(pages)/(app)/paper/oa/[id]/llm-generate";
import FeedItem from "../(pages)/(app)/discover/feed-item";

export async function Paper({ id }: { id: string }) {
	let paper = await fetchPaper(id);
	console.log(paper?.id, paper?.generated?.title);

	if (paper && !paper.generated) {
		paper = await generate(paper);
	}

	return <div>{paper && <FeedItem paper={paper} />}</div>;
}
