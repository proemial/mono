import { Main } from "@/components/main";
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
			<Main>{children}</Main>
		</div>
	);
}
