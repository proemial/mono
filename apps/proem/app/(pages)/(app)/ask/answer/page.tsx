import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { Edit05 } from "@untitled-ui/icons-react";
import { redirect } from "next/navigation";

type Props = {
	searchParams: {
		q?: string;
	};
};

export default async function AnswerPage({ searchParams }: Props) {
	const initialQuestion = searchParams.q;
	const { userId } = auth();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};
	if (!initialQuestion) {
		redirect(routes.ask);
	}
	const { isInternal } = getInternalUser();

	return (
		<>
			<NavBarV2
				action={
					<CloseAction
						target={routes.ask}
						iconOverride={<Edit05 className="size-5" />}
					/>
				}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Ask" />
			</NavBarV2>
			<Main>
				<Answer initialQuestion={initialQuestion} bookmarks={bookmarks} />
			</Main>
		</>
	);
}
