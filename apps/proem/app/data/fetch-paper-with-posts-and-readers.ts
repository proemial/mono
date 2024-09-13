import { PaperReadsService } from "@/services/paper-reads-service";
import { PostService } from "@/services/post-service";

/**
 * @deprecated use {@link: data/feed.ts} instead
 */
export const fetchPaperWithPostsAndReaders = async (
	paperId: string,
	spaceId: string | undefined,
) => {
	const [posts, readers] = await Promise.all([
		PostService.getPostsWithCommentsAndAuthors(spaceId, paperId),
		PaperReadsService.getReaders(paperId),
	]);
	return {
		paperId,
		posts,
		readers,
	};
};
