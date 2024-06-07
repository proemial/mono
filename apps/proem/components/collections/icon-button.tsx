import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	title?: string;
};

export const IconButton = ({ children, onClick, title }: Props) => (
	<div
		className="size-4 opacity-85 hover:opacity-100 active:opacity-75 duration-200 cursor-pointer"
		onClick={onClick}
		title={title}
	>
		{children}
	</div>
);
