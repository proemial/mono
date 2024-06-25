import { Collection } from "@proemial/data/neon/schema";

export const screenMaxWidth = "max-w-screen-md";
export const screenMaxWidthOrgManagement = "max-w-screen-lg";

export const PAPER_BOT_USER_ID = "paper_bot";
export const PERSONAL_DEFAULT_COLLECTION_NAME = "For you";
export const getPersonalDefaultCollection = (userId: string) =>
	({
		id: userId,
		name: PERSONAL_DEFAULT_COLLECTION_NAME,
		ownerId: userId,
		slug: userId,
		description:
			"This is your private collection. Papers you save will be stored here, unless you specify a different collection.",
		createdAt: new Date(),
	}) satisfies Collection;
export const getBookmarkCacheTag = (userId: string) => `bookmarks:${userId}`;
