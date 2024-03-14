import { create } from "zustand";

export type ChatTarget = "ask" | "paper";

export function useChatState(target: ChatTarget) {
	const ask = useAskChatState();
	const paper = usePaperChatState();
	const focus = useInputFocusState();

	return target === "ask" ? { ...ask, ...focus } : { ...paper, ...focus };
}

type InputFocusState = {
	focus: boolean;
	setFocus: (focus: boolean) => void;
};
export const useInputFocusState = create<InputFocusState>((set) => ({
	focus: false,
	setFocus: (focus) => set({ focus }),
}));

type AskChatState = {
	questions: string[];
	suggestions: string[];
	loading: boolean;
	appendQuestion: (question: string) => void;
	setSuggestions: (suggestions: string[]) => void;
	setLoading: (loading: boolean) => void;
};
export const useAskChatState = create<AskChatState>((set) => ({
	questions: [],
	suggestions: [],
	loading: false,
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
	setSuggestions: (suggestions) => set({ suggestions }),
	setLoading: (loading) => set({ loading }),
}));

type PaperChatState = {
	questions: string[];
	suggestions: string[];
	loading: boolean;
	appendQuestion: (question: string) => void;
	setSuggestions: (suggestions: string[]) => void;
	setLoading: (loading: boolean) => void;
};
export const usePaperChatState = create<PaperChatState>((set) => ({
	questions: [],
	suggestions: [],
	loading: false,
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
	setSuggestions: (suggestions) => set({ suggestions }),
	setLoading: (loading) => set({ loading }),
}));
