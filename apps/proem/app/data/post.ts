import { PostRepository } from "@proemial/data/repository/post";
import { Organisation } from "./organisation";

export type UserData = {
	userId: string;
	firstName: string | null;
	lastName: string | null;
	imageUrl?: string;
};

export module Post {
	export const getPostsWithCommentsAndAuthors = async ({
		spaceId,
		paperId,
		userId,
		organisationId,
	}: {
		spaceId?: string;
		paperId?: string;
		userId?: string;
		organisationId?: string;
	}) => {
		const orgMembersUserData =
			await Organisation.getOrgMembersUserData(organisationId);
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		const posts = await PostRepository.getPostsWithCommentsAndAuthors(
			spaceId,
			paperId,
			userId,
			orgMemberIds,
		);
		const authorIds = posts.map((post) => post.authorId);
		const authors = await Organisation.getUsers(authorIds);
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
	};
}
