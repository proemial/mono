"use server";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/(discover)/get-bookmarks-by-user-id";
import { auth } from "@clerk/nextjs";
import FeedItem from "../(discover)/feed-item";
import { fetchPaper } from "../paper/oa/[id]/fetch-paper";
import { generate } from "../paper/oa/[id]/llm-generate";

export async function Paper({ id }: { id: string }) {
	const { userId } = await auth();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};
	let paper = await fetchPaper(id);

	if (paper && !paper.generated) {
		paper = await generate(paper);
	}

	if (!paper) {
		return null;
	}

	return <FeedItem paper={paper} bookmarks={bookmarks} />;
}
