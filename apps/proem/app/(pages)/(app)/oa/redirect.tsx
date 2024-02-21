"use client";

import { usePaperState } from "@/app/components/login/state";
import { ReactNode, useEffect } from "react";

export function Redirect({ children }: { children: ReactNode }) {
	const { latest } = usePaperState();
	console.log("latest", latest);

	useEffect(() => {
		if (latest) {
			window.location.replace(`/oa/${latest}`);
		}
	}, [latest]);

	return <>{!latest && children}</>;
}
