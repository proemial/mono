import { Collection } from "@proemial/data/neon/schema";

export const screenMaxWidth = "max-w-screen-md";
export const screenMaxWidthOrgManagement = "max-w-screen-lg";

export const ANONYMOUS_USER_ID = "anonymous";
export const PAPER_BOT_USER_ID = "paper_bot";
export const PERSONAL_DEFAULT_COLLECTION_NAME = "For You";

/**
 * Empty personal default collection fallback for users without a collection in the database
 */
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
		shared: "private",
	}) satisfies Collection;

/**
 * @deprecated use {@link getBookmarkCacheTag} instead
 */
export const getBookmarkCacheTag = (collectionId: Collection["id"]) =>
	`bookmarks:${collectionId}`;

export const getBookmarkedPapersCacheTag = (collectionId: Collection["id"]) =>
	`bookmarked-papers:${collectionId}`;
