import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import PaperPage from "./paper-page";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	const { isInternal } = getInternalUser();
	const { userId } = auth();
	const userCollections = userId
		? await neonDb.query.collections.findMany({
				where: eq(collections.ownerId, userId),
			})
		: [];

	return (
		<>
			<NavBarV2
				action={<GoBackAction target="/discover" />}
				isInternalUser={isInternal}
			>
				<SelectSpaceHeader
					collections={userCollections}
					userId={userId ?? ""}
				/>
			</NavBarV2>
			<Main>
				<PaperPage paperId={params.id} type="oa" />
			</Main>
		</>
	);
}
