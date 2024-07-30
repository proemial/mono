"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface TypographyProps {
	children: React.ReactNode;
	className?: string;
}

export function Paragraph({ children, className }: TypographyProps) {
	return (
		<p className={cn("text-base/relaxed break-words", className)}>{children}</p>
	);
}

export function Header1({ children, className }: TypographyProps) {
	return (
		<h1
			className={cn(
				"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
				className,
			)}
		>
			{children}
		</h1>
	);
}

export function Header2({ children, className }: TypographyProps) {
	return (
		<h2 className={cn("scroll-m-20 text-2xl/normal font-normal", className)}>
			{children}
		</h2>
	);
}

export function Header3({ children, className }: TypographyProps) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl",
				className,
			)}
		>
			{children}
		</h3>
	);
}

export function Header4({ children, className }: TypographyProps) {
	return <h4 className={cn("text-lg", className)}>{children}</h4>;
}

export function Header5({ children, className }: TypographyProps) {
	return <h5 className={cn("text-2xs uppercase", className)}>{children}</h5>;
}
