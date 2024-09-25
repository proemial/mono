import { cn } from "@proemial/shadcn-ui";
import { ForwardedRef, ReactNode, forwardRef } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	title?: string;
	className?: string;
};

export const IconButton = forwardRef(
	(
		{ children, onClick, title, className }: Props,
		ref: ForwardedRef<HTMLDivElement>,
	) => (
		<div
			ref={ref}
			className={cn(
				"size-4 opacity-85 hover:opacity-100 active:opacity-75 duration-200 cursor-pointer",
				className,
			)}
			onClick={onClick}
			title={title}
		>
			{children}
		</div>
	),
);
