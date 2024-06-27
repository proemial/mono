import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
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

	return (
		<>
			<NavBar
				action={
					<CloseAction
						target={routes.ask}
						iconOverride={<Edit05 className="size-5" />}
					/>
				}
			>
				<SimpleHeader title="Ask" />
			</NavBar>
			<Main>
				<Answer initialQuestion={initialQuestion} bookmarks={bookmarks} />
			</Main>
		</>
	);
}
