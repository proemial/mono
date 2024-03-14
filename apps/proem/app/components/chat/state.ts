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

type ChatState = {
	question?: string;
	suggestions: string[];
	loading: boolean;
	addQuestion: (question: string) => void;
	clearQuestion: () => void;
	setSuggestions: (suggestions: string[]) => void;
	setLoading: (loading: boolean) => void;
};
export const useAskChatState = create<ChatState>((set) => ({
	suggestions: [],
	loading: false,
	addQuestion: (question) => set({ question }),
	clearQuestion: () => set({ question: undefined }),
	setSuggestions: (suggestions) => set({ suggestions }),
	setLoading: (loading) => set({ loading }),
}));

export const usePaperChatState = create<ChatState>((set) => ({
	suggestions: [],
	loading: false,
	addQuestion: (question) => set({ question }),
	clearQuestion: () => set({ question: undefined }),
	setSuggestions: (suggestions) => set({ suggestions }),
	setLoading: (loading) => set({ loading }),
}));
