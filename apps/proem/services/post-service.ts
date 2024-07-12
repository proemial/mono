import { getOrgMembersUserData } from "@/utils/auth";
import { auth } from "@clerk/nextjs/server";
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

export const PostService = {
	getSinglePaperIdWithPosts: async (
		paperId: string,
		spaceId: string | undefined,
	) => {
		const { userId } = auth();
		const orgMembersUserData = await getOrgMembersUserData();
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		return await findSinglePaperWithPosts(
			paperId,
			userId,
			orgMemberIds,
			spaceId,
		);
	},

	getPaperIdsWithPosts: async (
		paperIds: string[],
		spaceId: string | undefined,
	) => {
		const { userId } = auth();
		const orgMembersUserData = await getOrgMembersUserData();
		const orgMemberIds = orgMembersUserData.map((m) => m.userId);
		return await findPapersWithPosts(paperIds, userId, orgMemberIds, spaceId);
	},
};
