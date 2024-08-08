import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { Main } from "@/components/main";
import { ToggleSearchAction } from "@/components/nav-bar/actions/toggle-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import { getAvailableCollections } from "./get-available-collections";

type PageProps = CollectionIdParams & {
	children: ReactNode;
};

export default async function SpaceLayout({
	params: { collectionId },
	children,
}: PageProps) {
	const { userId, orgId } = auth();
	const combinedCollections = await getAvailableCollections(
		collectionId,
		userId,
		orgId,
	);

	return (
		<>
			<NavBar action={<ToggleSearchAction />}>
				<SelectSpaceHeader collections={combinedCollections} userId={userId} />
			</NavBar>
			<Main className="pt-0">{children}</Main>
		</>
	);
}
