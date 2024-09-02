import { create } from "zustand";

interface StoreState {
	consent: boolean;
	setConsent: (consent: boolean) => void;
}

export const usePostConsent = create<StoreState>()((set) => ({
	consent: false,
	setConsent: (consent) => {
		set((state) => ({
			consent,
		}));
	},
}));
