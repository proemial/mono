import { create } from "zustand";

type ShareItem = { content: React.ReactNode; link: string; title: string };

export type ShareDrawerState = {
  itemToBeShared: ShareItem | null;
  open: (link: ShareItem) => void;
  close: () => void;
};

export const useShareDrawerState = create<ShareDrawerState>((set) => ({
  itemToBeShared: null,
  open: (link) => set(() => ({ itemToBeShared: link })),
  close: () => set(() => ({ itemToBeShared: null })),
}));
