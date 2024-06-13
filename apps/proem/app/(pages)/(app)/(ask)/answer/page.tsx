import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[slug]/answer";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { AskHeader } from "@/components/nav-bar/headers/ask-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { redirect } from "next/navigation";

type Props = {
	searchParams: {
		q?: string;
	};
};

export default function AnswerPage({ searchParams }: Props) {
	const initialQuestion = searchParams.q;
	if (!initialQuestion) {
		redirect("/");
	}

	return (
		<>
			<NavBarV2 action={<GoBackAction />}>
				<AskHeader />
			</NavBarV2>
			<Main>
				<Answer initialQuestion={searchParams.q} />
			</Main>
		</>
	);
}
