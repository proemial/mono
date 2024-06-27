import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
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
			<NavBar action={<CloseAction target={routes.space} />}>
				<SimpleHeader title="Organization Management" />
			</NavBar>
			<Main>{children}</Main>
		</div>
	);
}
