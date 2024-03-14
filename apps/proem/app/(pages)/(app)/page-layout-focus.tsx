"use client";
import { useInputFocusState } from "@/app/components/chat/state";
import useIsKeyboardOpen from "@/app/components/mobile/keyboard";
import { ReactNode } from "react";

export function HideOnInput({ children }: { children: ReactNode }) {
	const { focus } = useInputFocusState();
	const isKeyboardOpen = useIsKeyboardOpen();

	if (focus && isKeyboardOpen) {
		return null;
	}

	return children;
}
