import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
};

export const CollectionListItemHeader = ({ children, onClick }: Props) => (
	<div
		className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200 cursor-pointer"
		onClick={onClick}
	>
		{children}
	</div>
);
