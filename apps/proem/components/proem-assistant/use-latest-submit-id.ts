import { create } from "zustand";

interface State {
	id: string | undefined;
	setId: (id: string | undefined) => void;
}

/**
 * Save the id (space or paper) in a store when a question is submitted.
 * Highlight if id matches and index of tuple is 0.
 */
export const useLatestSubmitId = create<State>()((set) => ({
	id: undefined,
	setId: (id) => {
		set((state) => ({
			id,
		}));
	},
}));
