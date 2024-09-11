import { useEffect, useState } from "react";

function getViewports() {
	return {
		viewport: {
			width: Math.max(
				globalThis.document?.documentElement.clientWidth || 0,
				globalThis.innerWidth || 0,
			),
			height: Math.max(
				globalThis.document?.documentElement.clientHeight || 0,
				globalThis.innerHeight || 0,
			),
		},
		visualViewport: {
			width: globalThis.visualViewport?.width,
			height: globalThis.visualViewport?.height,
		},
	};
}

function getViewportState() {
	const { viewport, visualViewport } = getViewports();
	const keyboardUp = !!(
		visualViewport.height && visualViewport.height < viewport.height
	);

	return { viewport, visualViewport, keyboardUp };
}

export function useVisualViewport() {
	const [state, setState] = useState(getViewportState);

	useEffect(() => {
		const handleResize = () => setState(getViewportState);

		window.visualViewport?.addEventListener("resize", handleResize);
		return () =>
			window.visualViewport?.removeEventListener("resize", handleResize);
	}, []);

	return state;
}
