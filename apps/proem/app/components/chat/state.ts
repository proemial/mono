import { create } from "zustand";

export type AskState = {
	questions: string[];
	appendQuestion: (question: string) => void;
};

export const useAskState = create<AskState>((set) => ({
	questions: [],
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
}));

export type PaperChatState = {
	questions: string[];
	appendQuestion: (question: string) => void;
};

export const usePaperChatState = create<PaperChatState>((set) => ({
	questions: [],
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
}));
