import { ANONYMOUS_USER_ID } from "@/app/constants";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";

const MAX_SPACES_TO_STORE = 5;
const LOCAL_STORAGE_KEY = "recent-spaces";
const LOCAL_STORAGE_SCHEMA = z.record(z.array(z.string()));

export const useRecentSpaces = () => {
	const auth = useAuth();
	const userId = auth.userId ?? ANONYMOUS_USER_ID;

	const parsedLocalStorage = parseLocalStorage();
	const currentUsersRecentSpaces = parsedLocalStorage
		? parsedLocalStorage[userId] ?? []
		: [];

	const addSpace = (spaceId: string) => {
		// Ignore default spaces as they're always shown in the selector
		if (spaceId === userId) {
			return currentUsersRecentSpaces;
		}
		const newSpaces = currentUsersRecentSpaces.filter((s) => s !== spaceId);
		newSpaces.push(spaceId);
		const sliceIndex =
			newSpaces.length - MAX_SPACES_TO_STORE < 0
				? 0
				: newSpaces.length - MAX_SPACES_TO_STORE;
		localStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify({
				...parsedLocalStorage,
				[userId]: newSpaces.slice(sliceIndex),
			}),
		);
		return newSpaces.slice(sliceIndex);
	};

	return {
		recentSpaces: currentUsersRecentSpaces,
		addSpace,
	};
};

const parseLocalStorage = () => {
	const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (existing) {
		return LOCAL_STORAGE_SCHEMA.parse(JSON.parse(existing));
	}
	return null;
};
