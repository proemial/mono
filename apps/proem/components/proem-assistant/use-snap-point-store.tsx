import { create } from "zustand";

interface SnapPointState {
	snapPoint: number;
	setSnapPoint: (snapPoint: number | string | null) => void;
}

export const useSnapPointStore = create<SnapPointState>()((set) => ({
	snapPoint: 1.0,
	setSnapPoint: (snapPoint) => {
		if (snapPoint && typeof snapPoint === "number") {
			set((state) => ({
				snapPoint,
			}));
		}
	},
}));
