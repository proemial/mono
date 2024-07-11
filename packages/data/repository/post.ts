import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { neonDb } from "../neon/db";
import {
	Collection,
	NewComment,
	NewPaper,
	NewPost,
	NewUser,
	collections,
	comments,
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

export const findSinglePaperWithPosts = async (
	paperId: string,
	userId: string | null,
	orgMemberIds: string[],
	spaceId: string | undefined,
) => {
	const space = await neonDb.query.collections.findFirst({
		where: eq(collections.id, spaceId ?? ""),
	});
	return await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: getPaperPostsQueryFragment(userId, orgMemberIds, space),
		},
	});
};

export const findPapersWithPosts = async (
	paperIds: string[],
	userId: string | null,
	orgMemberIds: string[],
	spaceId: string | undefined,
) => {
	if (paperIds.length === 0) {
		return [];
	}
	const space = await neonDb.query.collections.findFirst({
		where: eq(collections.id, spaceId ?? ""),
	});
	return await neonDb.query.papers.findMany({
		where: inArray(papers.id, paperIds),
		with: {
			posts: getPaperPostsQueryFragment(userId, orgMemberIds, space),
		},
	});
};

const getPaperPostsQueryFragment = (
	userId: string | null,
	orgMemberIds: string[],
	space: Collection | undefined,
) => {
	switch (space?.shared) {
		case "public":
			return {
				where: eq(posts.shared, "public"), // Public posts by anyone
			};
		case "organization":
			return {
				where: and(
					eq(posts.shared, "organization"),
					// Org members' posts (incl. own posts)
					inArray(
						posts.authorId,
						orgMemberIds.length > 0 ? orgMemberIds : [""],
					),
				),
			};
		case "private":
			return {
				where: and(
					eq(posts.shared, "private"),
					eq(posts.authorId, userId ?? ""), // Own posts
				),
			};
	}

	// Case: No space
	return {
		where: or(
			and(eq(posts.shared, "private"), eq(posts.authorId, userId ?? "")), // Own posts
			eq(posts.shared, "public"), // Public posts by anyone
		),
	};
};
