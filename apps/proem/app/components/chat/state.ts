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
	loading: boolean;
	appendQuestion: (question: string) => void;
	setLoading: (loading: boolean) => void;
};
const useAskChatState = create<AskChatState>((set) => ({
	questions: [],
	loading: false,
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
	setLoading: (loading) => set({ loading }),
}));

type PaperChatState = {
	questions: string[];
	loading: boolean;
	appendQuestion: (question: string) => void;
	setLoading: (loading: boolean) => void;
};
const usePaperChatState = create<PaperChatState>((set) => ({
	questions: [],
	loading: false,
	appendQuestion: (question) =>
		set((state) => ({ questions: [...state.questions, question] })),
	setLoading: (loading) => set({ loading }),
}));
