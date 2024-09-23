const MAX_SPACES_TO_STORE = 5;
const LOCAL_STORAGE_KEY = "recent-spaces-list";

/**
 * Store the ID's of (up to) the 5 recently-visited spaces in local storage.
 */
export const RecentSpaces = {
	get: () => {
		const local = localStorage.getItem(LOCAL_STORAGE_KEY);
		return local ? (JSON.parse(local) as string[]) : [];
	},

	add: (spaceId: string) => {
		const currentSpaces = RecentSpaces.get();
		const newSpaces = currentSpaces.filter((s) => s !== spaceId);
		newSpaces.push(spaceId);
		const sliceIndex =
			newSpaces.length - MAX_SPACES_TO_STORE < 0
				? 0
				: newSpaces.length - MAX_SPACES_TO_STORE;
		const cappedNewSpaces = newSpaces.slice(sliceIndex);
		if (cappedNewSpaces.join() !== currentSpaces.join()) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cappedNewSpaces));
			return cappedNewSpaces;
		}
		return currentSpaces;
	},
};
