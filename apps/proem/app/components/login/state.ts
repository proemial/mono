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
  open: () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("redirect_url", window.location.toString());
    window.location.search = searchParams.toString();
    set(() => ({ isOpen: true }));
  },
  close: () => set(() => ({ isOpen: false })),
}));
