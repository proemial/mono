import { ForwardedRef, ReactNode, forwardRef } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
};

export const CollectionListItemHeader = forwardRef(
	({ children, onClick }: Props, ref: ForwardedRef<HTMLDivElement>) => (
		<div
			ref={ref}
			className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200 cursor-pointer"
			onClick={onClick}
		>
			{children}
		</div>
	),
);
