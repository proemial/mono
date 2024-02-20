"use client";

import { ArrowDown } from "@/app/components/icons/arrows/arrow-down";
import { useState } from "react";
import { useEffect } from "react";

export function ScrollToBottom() {
	const isBrowser = () => typeof window !== "undefined";

	function scrollToBottom() {
		if (!isBrowser()) return;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	const [isVisible, setIsVisible] = useState(false);

	const handleScroll = () => {
		// Show the button when the user scrolls up
		if (window.scrollY > 100) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		// Add scroll event listener when the component mounts
		window.addEventListener("scroll", handleScroll);

		// Remove the event listener when the component unmounts
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<button
			className={`bg-[#2F2F2F] border border-[#3C3C3C] cursor-pointer fixed z-50 p-1.5 rounded-full bg-clip-padding right-1/2 bottom-20`}
			onClick={scrollToBottom}
		>
			<ArrowDown />
		</button>
	);
}
