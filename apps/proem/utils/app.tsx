"use client";
export function useIsApp() {
	if (typeof window === "undefined") return false;
	return window.location.host.split(".")[0] === "app";
}
