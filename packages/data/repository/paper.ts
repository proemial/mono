import { neonDb } from "..";
import { comments, papers, posts } from "../neon/schema";
import { eq, inArray } from "drizzle-orm";

export const getPaperPostsForUsers = async (
	paperId: string,
	users: string[],
) => {
	return await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: {
				columns: {
					paperId: false,
				},
				with: {
					comments: {
						columns: {
							postId: false,
						},
						// Only include own comments
						where: inArray(comments.authorId, users),
					},
				},
				// Only include own posts
				where: inArray(posts.authorId, users),
			},
		},
	});
};

export async function ensurePaperExistsInDb(paperId: string) {
	await neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing();
}
