import { getOrgMembersUserData, getUsers } from "@/utils/auth";
import { User, auth } from "@clerk/nextjs/server";
import { Post } from "@proemial/data/neon/schema";
import {
	findPapersWithPosts,
	findSinglePaperWithPosts,
} from "@proemial/data/repository/post";
import { Message } from "ai";

export type UserData = {
	userId: string;
	firstName: string | null;
	lastName: string | null;
	hasImage: boolean;
	imageUrl: string;
};

export type MessageWithAuthorUserData = Message & {
	createdAt: Date;
	authorUserData?: UserData;
	shared: Post["shared"];
};

export type PaperPost = NonNullable<
	Awaited<ReturnType<typeof PostService.getSinglePaperIdWithPosts>>
>["posts"][number];

export const PostService = {
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
