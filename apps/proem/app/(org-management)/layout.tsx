import { NavigationMenuBar } from "@/components/navigation-menu-bar";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";
import { screenMaxWidthOrgManagement } from "../constants";

type Props = {
	children: ReactNode;
};

export default function OrgManagementLayout({ children }: Props) {
	return (
		<div
			className={cn(
				"mx-auto min-h-[100dvh] flex flex-col",
				screenMaxWidthOrgManagement,
			)}
		>
			<NavigationMenuBar />
			<main className="w-full p-4 pb-0 flex flex-col flex-grow items-center">
				{children}
			</main>
		</div>
	);
}
