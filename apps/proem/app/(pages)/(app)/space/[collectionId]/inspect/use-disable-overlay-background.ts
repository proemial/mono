"use client";

import { useEffect } from "react";

export const useDisableOverlayBackground = () => {
	useEffect(() => {
		const overlay = document.getElementById("drawer-overlay");
		if (overlay) {
			const existingClasses = overlay.className;
			const existingClassesNoBackground = existingClasses.replace(
				"bg-black/80",
				"",
			);
			overlay.className = existingClassesNoBackground;
		}
	}, []);
};
