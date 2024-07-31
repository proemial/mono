import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type ThemeColoredCardProps = {
	children: ReactNode;
	className?: string;
};

export const ThemeColoredCard = ({
	children,
	className,
}: ThemeColoredCardProps) => {
	return (
		<div className={cn("p-3 rounded-2xl bg-gray-200", className)}>
			{children}
		</div>
	);
};
