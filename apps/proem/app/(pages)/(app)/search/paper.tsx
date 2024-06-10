"use server";
import FeedItem from "../discover/feed-item";
import { fetchPaper } from "../paper/oa/[id]/fetch-paper";
import { generate } from "../paper/oa/[id]/llm-generate";

export async function Paper({ id }: { id: string }) {
	let paper = await fetchPaper(id);
	console.log(paper?.id, paper?.generated?.title);

	if (paper && !paper.generated) {
		paper = await generate(paper);
	}

	return <div>{paper && <FeedItem paper={paper} />}</div>;
}
