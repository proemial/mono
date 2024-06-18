import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import PaperPage from "../../oa/[id]/paper-page";

type Props = {
	params: { id: string };
};

export default async function ArXivPaperPage({ params }: Props) {
	const { isInternal } = getInternalUser();
	return (
		<>
			<NavBarV2 action={<GoBackAction />} isInternalUser={isInternal}>
				<SelectSpaceHeader />
			</NavBarV2>
			<Main>
				<PaperPage paperId={params.id} type="arxiv" />
			</Main>
		</>
	);
}
