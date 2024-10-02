import { create } from "zustand";

interface State {
	submitId: string | undefined;
	submitIndex: number;
	setSubmitId: (id: string, index?: number) => void;
	clearSubmitId: () => void;
}

/**
 * Save the id (space or paper) in a store when a question is submitted.
 * Highlight if id matches and index of tuple is 0.
 */
export const useLatestSubmitId = create<State>()((set) => ({
	submitId: undefined,
	submitIndex: 0,
	setSubmitId: (id, index = 0) => {
		set((state) => ({
			submitId: id,
			submitIndex: index,
		}));
	},
	clearSubmitId: () => {
		set((state) => ({
			submitId: undefined,
		}));
	},
}));
