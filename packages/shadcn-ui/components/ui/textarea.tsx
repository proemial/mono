"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onFocusOut?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, onFocusOut, ...props }, ref) => {
		const fieldRef = useRef<HTMLTextAreaElement | null>();

		useEffect(() => {
			if (fieldRef?.current) {
				const node = fieldRef.current;

				if (node && onFocusOut) {
					node.addEventListener("focusout", onFocusOut);
					return () => {
						node.removeEventListener("focusout", onFocusOut);
					};
				}
			}
		}, [onFocusOut]);

		return (
			<textarea
				className={cn(
					"flex w-full p-2 h-fit bg-primary text-sm outline-none placeholder:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={(node) => {
					fieldRef.current = node;
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
				}}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
