import { getOrgMembersUserData, getUsers } from "@/utils/auth";
import { auth } from "@clerk/nextjs/server";
import { PostRepository } from "@proemial/data/repository/post";

export type UserData = {
	userId: string;
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | undefined;
};

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
};
