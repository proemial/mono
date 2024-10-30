import { screenMaxWidth } from "@/app/constants";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div className="bg-background group relative">
			<div
				style={{
					boxShadow: "0 0 120px rgba(0, 0, 0, .15)",
				}}
				className={cn("mx-auto min-h-[100dvh] flex flex-col", screenMaxWidth)}
			>
				{children}
			</div>
		</div>
	);
}
