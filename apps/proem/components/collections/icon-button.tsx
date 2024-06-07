import { ForwardedRef, ReactNode, forwardRef } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	title?: string;
};

export const IconButton = forwardRef(
	({ children, onClick, title }: Props, ref: ForwardedRef<HTMLDivElement>) => (
		<div
			ref={ref}
			className="size-4 opacity-85 hover:opacity-100 active:opacity-75 duration-200 cursor-pointer"
			onClick={onClick}
			title={title}
		>
			{children}
		</div>
	),
);
