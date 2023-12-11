import { create } from 'zustand'

export type DrawerState = {
  isOpen: boolean,
  setOpen: (open: boolean) => void,
  toggle: () => void,
  open: () => void,
  close: () => void,
};

export const useDrawerState = create<DrawerState>(set => ({
  isOpen: false,
  setOpen: (isOpen) => set(() => ({isOpen})),
  toggle: () => set((state) => ({isOpen: !state.isOpen})),
  open: () => set(() => ({isOpen: true})),
  close: () => set(() => ({isOpen: false})),
}))
