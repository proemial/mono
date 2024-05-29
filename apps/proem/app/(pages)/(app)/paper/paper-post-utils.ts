import { PAPER_BOT_USER_ID } from "@/app/constants";
import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import {
	Comment,
	Post,
	comments,
	papers,
	posts,
} from "@proemial/data/neon/schema";
import { eq, inArray } from "drizzle-orm";

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

export const getOwnPaperPosts = async (paperId: string) => {
	const { userId } = auth();
	if (!userId) {
		return [];
	}
	const paper = await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: {
				columns: {
					paperId: false,
				},
				with: {
					comments: {
						columns: {
							postId: false,
						},
						// Only include own comments
						where: inArray(comments.authorId, [userId, PAPER_BOT_USER_ID]),
					},
				},
				// Only include own posts
				where: inArray(posts.authorId, [userId, PAPER_BOT_USER_ID]),
			},
		},
	});
	if (!paper) {
		return [];
	}
	/**
	 * Add author user data to posts and their comments.
	 */
	const user = await clerkClient.users.getUser(userId);
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

export const getOrgMemberPaperPosts = async (paperId: string) => {
	const orgMembersUserData = await getOrgMembersUserData();
	if (orgMembersUserData.length === 0) {
		return [];
	}
	const orgMemberIds = orgMembersUserData.map((data) => data.userId);
	const paper = await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: {
				columns: {
					paperId: false,
				},
				with: {
					comments: {
						columns: {
							postId: false,
						},
						// Only include comments from org members and AI assistant
						where: inArray(comments.authorId, [
							...orgMemberIds,
							PAPER_BOT_USER_ID,
						]),
					},
				},
				// Only include posts from org members and AI assistant
				where: inArray(posts.authorId, [...orgMemberIds, PAPER_BOT_USER_ID]),
			},
		},
	});
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

const getOrgMembersUserData = async () => {
	const authData = auth();
	if (!authData.orgId) {
		return [];
	}
	const orgMemberships =
		await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: authData.orgId,
		});
	return orgMemberships
		.filter((membership) => membership.publicUserData)
		.map(
			(membership) => membership.publicUserData,
		) as OrganizationMembershipPublicUserData[];
};
