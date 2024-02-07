import { create } from "zustand";

export type DrawerState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useDrawerState = create<DrawerState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set(() => ({ isOpen })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
}));

export type PaperState = {
  latest?: string;
  setLatest: (latest: string) => void;
};

export const usePaperState = create<PaperState>((set) => ({
  latest: undefined,
  setLatest: (latest) => set(() => ({ latest })),
}));
