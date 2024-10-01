import { create } from "zustand";

interface SnapPointState {
	activeSnapPoint: number;
	setActiveSnapPoint: (point: number | string | null) => void;
	snapPoints: number[];
	setSnapPoints: (points: number[]) => void;
}

export const useSnapPointStore = create<SnapPointState>()((set) => ({
	activeSnapPoint: 1.0,
	setActiveSnapPoint: (point) => {
		if (point && typeof point === "number") {
			set((state) => ({
				activeSnapPoint: point,
			}));
		}
	},
	snapPoints: [0.0, 1.0],
	setSnapPoints: (points) => {
		set((state) => ({
			snapPoints: points,
		}));
	},
}));
