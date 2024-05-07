"use client";
import { MouseEvent, ReactNode, useRef, useState } from "react";

type Props = {
	className: string;
	children: ReactNode;
};

export function DragScrollContainer({ className = "", children }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const [mouseDown, setMouseDown] = useState(false);
	const coords = useRef({ startX: 0, scrollLeft: 0 });

	const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return;

		e.preventDefault();
		updateCursor(e.currentTarget);

		const slider = ref.current.children[0] as HTMLDivElement;
		const startX = e.pageX - slider.offsetLeft;
		const scrollLeft = slider.scrollLeft;
		coords.current = { startX, scrollLeft };

		setMouseDown(true);
	};

	const handleDrag = (e: MouseEvent<HTMLDivElement>) => {
		if (!mouseDown || !ref.current) return;

		e.preventDefault();
		updateCursor(e.currentTarget);

		const slider = ref.current.children[0] as HTMLDivElement;
		const x = e.pageX - slider.offsetLeft;
		const walkX = (x - coords.current.startX) * 1.5;
		slider.scrollLeft = coords.current.scrollLeft - walkX;
	};

	const handleDragEnd = (e: MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return;

		e.preventDefault();
		resetCursor(e.currentTarget);

		setMouseDown(false);
	};

	return (
		<div
			ref={ref}
			onMouseDown={handleDragStart}
			onMouseUp={handleDragEnd}
			onMouseMove={handleDrag}
			className={`overflow-x-scroll touch-none cursor-grab ${className}`}
		>
			{children}
		</div>
	);
}

// TODO: Cursors are currently broken
function updateCursor(e: HTMLDivElement) {
	e.style.cursor = "grabbing";
	e.style.userSelect = "none";
}

function resetCursor(e: HTMLDivElement) {
	e.style.cursor = "grab";
	e.style.removeProperty("user-select");
}
