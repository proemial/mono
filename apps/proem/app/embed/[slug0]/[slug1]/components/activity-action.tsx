"use server";
import { fetchPaperWithPostsAndReaders } from "@/app/data/feed";

export const activityAction = async (id: string) => {
	"use server";
	return await fetchPaperWithPostsAndReaders({
		paperId: id.split("/").at(-1) as string,
	});
};
