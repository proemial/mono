import { PAPER_BOT_USER_ID } from "@/app/constants";
import { getOrgMembersUserData } from "@/utils/auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Comment, Paper, Post } from "@proemial/data/neon/schema";
import { getPaperPostsForUsers } from "@proemial/data/repository/paper";
import {
	findPapersWithPosts,
	findSinglePaperWithPosts,
} from "@proemial/data/repository/post";
import { Message, nanoid } from "ai";

export type UserData = {
	userId: string;
	firstName: string | null;
	lastName: string | null;
	hasImage: boolean;
	imageUrl: string;
};

export type PaperPost = Omit<Post, "paperId"> & {
	authorUserData: UserData;
	comments: (Omit<Comment, "postId"> & {
		authorUserData?: UserData;
	})[];
};

export type MessageWithAuthorUserData = Message & {
	createdAt: Date;
	authorUserData?: UserData;
};

/**
 * Simple conversion from paper posts to Vercel AI messages. Returns posts and
 * comments in a flat array.
 *
 * Additions:
 *   - Added a non-null `createdAt` field to each message.
 *   - Added author user data to each message.
 */
export const paperPostsToMessages = (
	paperPosts: PaperPost[],
): MessageWithAuthorUserData[] => {
	const messages: MessageWithAuthorUserData[] = [];
	for (const post of paperPosts) {
		messages.push({
			id: nanoid(),
			role: "user",
			content: post.content,
			createdAt: post.createdAt,
			authorUserData: post.authorUserData,
		});
		for (const comment of post.comments) {
			messages.push({
				id: nanoid(),
				role: "assistant",
				content: comment.content,
				createdAt: comment.createdAt,
				authorUserData: comment.authorUserData,
			});
		}
	}
	return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

export const getSinglePaperIdWithPosts = async (
	paperId: string,
	spaceId: string | undefined,
) => {
	const { userId } = auth();
	const orgMembersUserData = await getOrgMembersUserData();
	const orgMemberIds = orgMembersUserData.map((m) => m.userId);
	return await findSinglePaperWithPosts(paperId, userId, orgMemberIds, spaceId);
};

export const getPaperIdsWithPosts = async (
	paperIds: string[],
	spaceId: string | undefined,
) => {
	const { userId } = auth();
	const orgMembersUserData = await getOrgMembersUserData();
	const orgMemberIds = orgMembersUserData.map((m) => m.userId);
	return await findPapersWithPosts(paperIds, userId, orgMemberIds, spaceId);
};

// TODO: Get rid of the following functions and use the above functions instead

export const getPaperPosts = async (paperId: Paper["id"]) => {
	// Get paper posts from org members, or user's own posts if there are none
	const paperPosts = await getOrgMemberPaperPosts(paperId);
	if (paperPosts.length === 0) {
		return await getOwnPaperPosts(paperId);
	}
	return paperPosts;
};

const getOwnPaperPosts = async (paperId: string) => {
	const { userId } = auth();
	if (!userId) {
		return [];
	}
	const paper = await getPaperPostsForUsers(paperId, [
		userId,
		PAPER_BOT_USER_ID,
	]);
	if (!paper) {
		return [];
	}
	/**
	 * Add author user data to posts and their comments.
	 */
	const user = await currentUser();
	if (!user) {
		return [];
	}
	const authorUserData: UserData = {
		userId,
		firstName: user.firstName,
		lastName: user.lastName,
		hasImage: user.hasImage,
		imageUrl: user.imageUrl,
	};
	const paperPosts: PaperPost[] = [];
	for (const post of paper.posts) {
		const comments: PaperPost["comments"] = [];
		for (const comment of post.comments) {
			if (comment.authorId === PAPER_BOT_USER_ID) {
				comments.push(comment);
				continue;
			}
			comments.push({
				...comment,
				authorUserData,
			});
		}
		paperPosts.push({
			...post,
			comments,
			authorUserData,
		});
	}
	return paperPosts;
};

const getOrgMemberPaperPosts = async (paperId: string) => {
	const orgMembersUserData = await getOrgMembersUserData();
	if (orgMembersUserData.length === 0) {
		return [];
	}
	const orgMemberIds = orgMembersUserData.map((data) => data.userId);

	const paper = await getPaperPostsForUsers(paperId, [
		...orgMemberIds,
		PAPER_BOT_USER_ID,
	]);
	if (!paper) {
		return [];
	}
	const paperPosts: PaperPost[] = [];
	/**
	 * Add author user data to posts and their comments, filtering out posts and
	 * replies w/o user data matching current members of the org. AI assistant
	 * replies are not filtered out.
	 */
	for (const post of paper.posts) {
		const comments: PaperPost["comments"] = [];
		for (const comment of post.comments) {
			if (comment.authorId === PAPER_BOT_USER_ID) {
				comments.push(comment);
				continue;
			}
			const commentAuthorUserData = orgMembersUserData.find(
				(data) => data.userId === comment.authorId,
			);
			if (commentAuthorUserData) {
				const { userId, firstName, lastName, hasImage, imageUrl } =
					commentAuthorUserData;
				comments.push({
					...comment,
					authorUserData: {
						userId,
						firstName,
						lastName,
						hasImage,
						imageUrl,
					},
				});
			}
		}
		const postAuthorUserData = orgMembersUserData.find(
			(data) => data.userId === post.authorId,
		);
		if (postAuthorUserData) {
			const { userId, firstName, lastName, hasImage, imageUrl } =
				postAuthorUserData;
			paperPosts.push({
				...post,
				comments,
				authorUserData: {
					userId,
					firstName,
					lastName,
					hasImage,
					imageUrl,
				},
			});
		}
	}
	return paperPosts;
};
