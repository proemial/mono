"use client";
import { useEffect, useState } from "react";

export function useIsApp() {
	const [isApp, setIsApp] = useState(false);

	useEffect(() => {
		// Simple check for mobile app - this is just a placeholder
		const userAgent = navigator.userAgent.toLowerCase();
		const isIOS = /iphone|ipad|ipod/.test(userAgent);
		const isAndroid = /android/.test(userAgent);

		setIsApp(isIOS || isAndroid);
	}, []);

	return isApp;
}
