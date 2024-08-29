import { and, asc, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { neonDb } from "../neon/db";
import {
	NewComment,
	NewPost,
	collections,
	comments,
	papers,
	posts,
	users,
} from "../neon/schema";

const ANONYMOUS_USER_ID = "anonymous"; // TODO: Share between projects

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
					postPermissions(userId, orgMemberIds),
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
				where: and(
					eq(posts.spaceId, spaceId),
					postPermissions(userId, orgMemberIds),
				),
				with: { comments: { orderBy: [asc(comments.createdAt)] }, space: true },
				orderBy: [desc(posts.createdAt)],
			});
			// Filter out posts from deleted spaces
			return spacePosts.filter((post) => post.space?.deletedAt === null);
		}
		// For anonymous users
		const publicPosts = await neonDb.query.posts.findMany({
			where: postPermissions(ANONYMOUS_USER_ID, []),
			with: { comments: { orderBy: [asc(comments.createdAt)] }, space: true },
			orderBy: [desc(posts.createdAt)],
		});
		return publicPosts.filter((post) => {
			// Filter out posts from deleted spaces
			if (post.space?.deletedAt) {
				return false;
			}
			return true;
		});
	},
};

const postPermissions = (
	userId: string | null | undefined,
	orgMemberIds: string[],
) =>
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

export async function getPostBySlug(slug: string) {
	return await neonDb.query.posts.findFirst({
		where: eq(posts.slug, slug),
		with: {
			space: true,
			paper: true,
			comments: true,
			author: true,
		},
	});
}
