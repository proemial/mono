import { useEffect, useState } from "react";

function useIsKeyboardOpen(minKeyboardHeight = 300) {
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

	useEffect(() => {
		const listener = () => {
			const newState =
				window.screen.height - minKeyboardHeight >
				(window?.visualViewport?.height ?? 0);
			if (isKeyboardOpen !== newState) {
				setIsKeyboardOpen(newState);
			}
		};
		if (typeof visualViewport !== "undefined") {
			window?.visualViewport?.addEventListener("resize", listener);
		}
		return () => {
			if (typeof visualViewport !== "undefined") {
				window?.visualViewport?.removeEventListener("resize", listener);
			}
		};
	}, [isKeyboardOpen, minKeyboardHeight]);

	return isKeyboardOpen;
}

export default useIsKeyboardOpen;
