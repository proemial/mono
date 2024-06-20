import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";
import { screenMaxWidthOrgManagement } from "../constants";
import { getInternalUser } from "../hooks/get-internal-user";

type Props = {
	children: ReactNode;
};

export default function OrgManagementLayout({ children }: Props) {
	const { isInternal } = getInternalUser();

	return (
		<div
			className={cn(
				"mx-auto min-h-[100dvh] flex flex-col",
				screenMaxWidthOrgManagement,
			)}
		>
			<NavBarV2
				action={<CloseAction target="/discover" />}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Organization Management" />
			</NavBarV2>
			<Main>{children}</Main>
		</div>
	);
}
