import { Collection } from "@proemial/data/neon/schema";

export const screenMaxWidth = "max-w-screen-md";
export const screenMaxWidthOrgManagement = "max-w-screen-lg";

export const PAPER_BOT_USER_ID = "paper_bot";
export const PERSONAL_DEFAULT_COLLECTION_NAME = "For You";
export const getPersonalDefaultCollection = (userId: string) =>
	({
		id: userId,
		name: PERSONAL_DEFAULT_COLLECTION_NAME,
		ownerId: userId,
		orgId: null,
		slug: userId,
		description: "",
		createdAt: new Date(),
		deletedAt: null,
	}) satisfies Collection;

/**
 * @deprecated use {@link getBookmarkCacheTag} instead
 */
export const getBookmarkCacheTag = (collectionId: Collection["id"]) =>
	`bookmarks:${collectionId}`;

export const getBookmarkedPapersCacheTag = (collectionId: Collection["id"]) =>
	`bookmarked-papers:${collectionId}`;
