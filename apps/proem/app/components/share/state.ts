import { create } from "zustand";

type ShareItem = { content: React.ReactNode; link: string; title: string };

export type ShareDrawerState = {
	itemToBeShared: ShareItem | null;
	openShareDrawer: (link: ShareItem) => void;
	closeShareDrawer: () => void;
};

export const useShareDrawerState = create<ShareDrawerState>((set) => ({
	itemToBeShared: null,
	openShareDrawer: (link) => set(() => ({ itemToBeShared: link })),
	closeShareDrawer: () => set(() => ({ itemToBeShared: null })),
}));
