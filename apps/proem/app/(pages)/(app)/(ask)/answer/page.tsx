import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[id]/answer";
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

	return <Answer initialQuestion={searchParams.q} />;
}
