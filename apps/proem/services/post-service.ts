import { Organisation } from "@/app/data/organisation";
import { User } from "@/app/data/user";
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

/**
 * @deprecated use {@link: Post.getPostsWithCommentsAndAuthors} instead
 */
export const PostService = {
	getPostsWithCommentsAndAuthors: async (
		spaceId: string | undefined,
		paperId: string | undefined,
	) => {
		const { userId, orgId } = auth();
		const orgMembersUserData = orgId
			? await Organisation.getOrgMembersUserData(orgId)
			: [];
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		const posts = await PostRepository.getPostsWithCommentsAndAuthors(
			spaceId,
			paperId,
			userId,
			orgMemberIds,
		);
		const authorIds = posts.map((post) => post.authorId);
		const authors = await User.getUsers(authorIds);
		return posts.map((post) => {
			const author = authors.find((user) => user.id === post.authorId);
			return {
				...post,
				author: {
					id: post.authorId,
					firstName: author?.firstName ?? undefined,
					lastName: author?.lastName ?? undefined,
					imageUrl: author?.hasImage ? author.imageUrl : undefined,
				},
			};
		});
	},
};
