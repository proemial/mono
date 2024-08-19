import { Throbber } from "@/components/throbber";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

interface LoadingTransitionProps {
	children: ReactNode;
	type: "page" | "section";
	as?: React.ElementType;
}

export function LoadingTransition({
	children,
	type,
	as = "div",
}: LoadingTransitionProps) {
	const Component = as;
	return (
		<>
			<div className="relative">
				<div
					className={cn(
						"opacity-0 transition-all ease-in-out duration-300 absolute left-1/2 -translate-x-1/2 -top-10",
						{
							"group-has-[[data-page-transition]]:opacity-100 group-has-[[data-page-transition]]:translate-y-10":
								type === "page",
							"group-has-[[data-section-transition]]:opacity-100 group-has-[[data-section-transition]]:translate-y-10":
								type === "section",
						},
					)}
				>
					<Throbber />
				</div>
			</div>
			<Component
				className={cn("transition-all ease-in-out duration-300 origin-top", {
					"group-has-[[data-page-transition]]:opacity-0 group-has-[[data-page-transition]]:translate-y-10 group-has-[[data-page-transition]]:blur-sm group-has-[[data-page-transition]]:scale-95":
						type === "page",
					"group-has-[[data-section-transition]]:opacity-0 group-has-[[data-section-transition]]:translate-y-10 group-has-[[data-section-transition]]:blur-sm group-has-[[data-section-transition]]:scale-95":
						type === "section",
				})}
			>
				{children}
			</Component>
		</>
	);
}
