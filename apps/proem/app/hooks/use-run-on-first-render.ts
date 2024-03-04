import { useEffect, useRef } from "react";

export function useRunOnFirstRender(callback: () => void) {
	const hasRun = useRef(false);

	useEffect(() => {
		if (!hasRun.current) {
			callback();
			hasRun.current = true;
		}
	}, [callback]);
}
