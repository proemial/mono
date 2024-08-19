import { and, asc, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { neonDb } from "../neon/db";
import {
	Collection,
	NewComment,
	NewPost,
	collections,
	comments,
	papers,
	posts,
	users,
} from "../neon/schema";

export const PostRepository = {
	getPostsWithCommentsAndAuthors: async (
		spaceId: string | undefined,
		paperId: string | undefined,
		userId: string | null | undefined,
		orgMemberIds: string[] = [],
	) => {
		if (paperId) {
			return await neonDb.query.posts.findMany({
				where: and(
					eq(posts.paperId, paperId),
					byShared(userId ?? "", orgMemberIds),
				),
				with: { comments: { orderBy: [asc(comments.createdAt)] } },
				orderBy: [desc(posts.createdAt)],
			});
		}
		if (spaceId) {
			const space = await neonDb.query.collections.findFirst({
				where: and(
					eq(collections.id, spaceId ?? ""),
					isNull(collections.deletedAt),
				),
			});
			if (!space) {
				return [];
			}
			const spacePosts = await neonDb.query.posts.findMany({
				where: and(eq(posts.spaceId, spaceId), byShared(userId, orgMemberIds)),
				with: { comments: { orderBy: [asc(comments.createdAt)] }, space: true },
				orderBy: [desc(posts.createdAt)],
			});
			// Filter out posts from deleted spaces
			return spacePosts.filter((post) => post.space?.deletedAt === null);
		}
		return [];
	},
};

const byShared = (userId: string | null | undefined, orgMemberIds: string[]) =>
	or(
		// Public posts
		and(eq(posts.shared, "public")),
		// Posts by org members
		and(
			eq(posts.shared, "organization"),
			inArray(posts.authorId, orgMemberIds.length > 0 ? orgMemberIds : [""]),
		),
		// Own posts
		and(eq(posts.shared, "private"), eq(posts.authorId, userId ?? "")),
	);

export async function savePostWithComment(
	post: NewPost,
	comment: Omit<NewComment, "postId">,
) {
	// Create paper and user if not already exists
	await Promise.all([
		...(post.paperId
			? [
					neonDb
						.insert(papers)
						.values({ id: post.paperId })
						.onConflictDoNothing(),
				]
			: []),
		neonDb.insert(users).values({ id: post.authorId }).onConflictDoNothing(),
	]);
	// Save post
	const insertedPost = await neonDb
		.insert(posts)
		.values(post)
		.returning({ id: posts.id });
	if (insertedPost[0]) {
		// Save paper bot reply
		await neonDb.insert(comments).values({
			postId: insertedPost[0].id,
			content: comment.content,
			authorId: comment.authorId,
			followUps: comment.followUps,
			papers: comment.papers,
		});
	}
}

/**
 * @deprecated Use `getPostsWithCommentsAndAuthors` (above) instead
 */
export const findSinglePaperWithPosts = async (
	paperId: string,
	userId: string | null,
	orgMemberIds: string[],
	spaceId: string | undefined,
) => {
	const space = await neonDb.query.collections.findFirst({
		where: and(
			eq(collections.id, spaceId ?? ""),
			isNull(collections.deletedAt),
		),
	});
	return await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: {
				where: getPostsWhereClause(userId, orgMemberIds, space),
				with: { comments: { orderBy: [asc(comments.createdAt)] } },
				orderBy: [desc(posts.createdAt)],
			},
		},
	});
};

/**
 * @deprecated Use `getPostsWithCommentsAndAuthors` (above) instead
 */
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
		where: and(
			eq(collections.id, spaceId ?? ""),
			isNull(collections.deletedAt),
		),
	});
	return await neonDb.query.papers.findMany({
		where: inArray(papers.id, paperIds),
		with: {
			posts: {
				where: getPostsWhereClause(userId, orgMemberIds, space),
				with: { comments: { orderBy: [asc(comments.createdAt)] } },
				orderBy: [desc(posts.createdAt)],
			},
		},
	});
};

const getPostsWhereClause = (
	userId: string | null,
	orgMemberIds: string[],
	space: Collection | undefined,
) => {
	switch (space?.shared) {
		case "public":
			return eq(posts.shared, "public"); // Public posts by anyone
		case "organization":
			return and(
				eq(posts.shared, "organization"),
				// Org members' posts (incl. own posts)
				inArray(posts.authorId, orgMemberIds.length > 0 ? orgMemberIds : [""]),
			);
		case "private":
			return and(
				eq(posts.shared, "private"),
				eq(posts.authorId, userId ?? ""), // Own posts
			);
	}

	// Case: No space
	return or(
		and(eq(posts.shared, "private"), eq(posts.authorId, userId ?? "")), // Own posts
		eq(posts.shared, "public"), // Public posts by anyone
	);
};
