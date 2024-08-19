import { getOrgMembersUserData, getUsers } from "@/utils/auth";
import { User, auth } from "@clerk/nextjs/server";
import {
	findPapersWithPosts,
	findSinglePaperWithPosts,
} from "@proemial/data/repository/post";
import { PostRepository } from "@proemial/data/repository/post";

export type UserData = {
	userId: string;
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | undefined;
};

export type PaperPost = NonNullable<
	Awaited<ReturnType<typeof PostService.getSinglePaperIdWithPosts>>
>["posts"][number];

export type PostWithCommentsAndAuthor = Awaited<
	ReturnType<typeof PostService.getPostsWithCommentsAndAuthors>
>[number];

export const PostService = {
	getPostsWithCommentsAndAuthors: async (
		spaceId: string | undefined,
		paperId: string | undefined,
	) => {
		const { userId } = auth();
		const orgMembersUserData = await getOrgMembersUserData();
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		const posts = await PostRepository.getPostsWithCommentsAndAuthors(
			spaceId,
			paperId,
			userId,
			orgMemberIds,
		);
		const authorIds = posts.map((post) => post.authorId);
		const authors = await getUsers(authorIds);
		return posts.map((post) => {
			const author = authors.find((user) => user.id === post.authorId);
			return {
				...post,
				author: author && {
					id: post.authorId,
					firstName: author?.firstName ?? undefined,
					lastName: author?.lastName ?? undefined,
					imageUrl: author?.hasImage ? author.imageUrl : undefined,
				},
			};
		});
	},

	/**
	 * @deprecated Use `getPostsWithCommentsAndAuthors` (above) instead
	 */
	getSinglePaperIdWithPosts: async (
		paperId: string,
		spaceId: string | undefined,
	) => {
		const { userId } = auth();
		const orgMembersUserData = await getOrgMembersUserData();
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		const paperWithPosts = await findSinglePaperWithPosts(
			paperId,
			userId,
			orgMemberIds,
			spaceId,
		);
		if (!paperWithPosts) return undefined;
		const authors = await getUsers(
			paperWithPosts.posts.map((post) => post.authorId),
		);
		return withAuthorDetails(paperWithPosts, authors);
	},

	/**
	 * @deprecated Use `getPostsWithCommentsAndAuthors` (above) instead
	 */
	getPaperIdsWithPosts: async (
		paperIds: string[],
		spaceId: string | undefined,
	) => {
		const { userId } = auth();
		const orgMembersUserData = await getOrgMembersUserData();
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		const papersWithPosts = await findPapersWithPosts(
			paperIds,
			userId,
			orgMemberIds,
			spaceId,
		);
		const authorIds = papersWithPosts.flatMap((paperWithPosts) =>
			paperWithPosts.posts.map((post) => post.authorId),
		);
		const authors = await getUsers(authorIds);
		return papersWithPosts.map((paperWithPosts) =>
			withAuthorDetails(paperWithPosts, authors),
		);
	},
};

const withAuthorDetails = (
	paperWithPosts: NonNullable<
		Awaited<ReturnType<typeof findSinglePaperWithPosts>>
	>,
	authors: User[],
) => ({
	...paperWithPosts,
	posts: paperWithPosts.posts.map((post) => {
		const author = authors.find((user) => user.id === post.authorId);
		return {
			...post,
			author: {
				id: post.authorId,
				imageUrl: author?.hasImage ? author.imageUrl : undefined,
				firstName: author?.firstName ?? null,
				lastName: author?.lastName ?? null,
			},
		};
	}),
});
