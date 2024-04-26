import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useEffectOnce = (
	effect: EffectCallback,
	deps: DependencyList = [],
) => {
	const hasRun = useRef(false);

	useEffect(() => {
		if (!hasRun.current) {
			hasRun.current = true;
			return effect();
		}
	}, [effect, ...deps]);
};
