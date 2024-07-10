import { neonDb } from "../neon/db";
import {
	comments,
	NewComment,
	NewPaper,
	NewPost,
	NewUser,
	papers,
	posts,
	users,
} from "../neon/schema";

export async function savePostAndReply(
	paper: NewPaper,
	user: NewUser,
	post: NewPost,
	commentContent: NewComment["content"],
	author: string,
) {
	// Create paper and user if not already exists
	await Promise.all([
		neonDb.insert(papers).values(paper).onConflictDoNothing(),
		neonDb.insert(users).values(user).onConflictDoNothing(),
	]);
	// Save post
	const insertedPost = await neonDb
		.insert(posts)
		.values(post)
		.returning({ id: posts.id });
	if (insertedPost[0]) {
		// Save paper bot reply
		await neonDb.insert(comments).values({
			content: commentContent,
			authorId: author,
			postId: insertedPost[0].id,
		});
	}
}
