import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type MainProps = {
	children: ReactNode;
	className?: string;
};

export const Main = ({ children, className }: MainProps) => {
	return (
		<main
			className={cn("w-full p-4 pb-0 flex flex-col flex-grow z-10", className)}
		>
			{children}
		</main>
	);
};
