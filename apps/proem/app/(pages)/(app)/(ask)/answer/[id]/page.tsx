import { Answer } from "./answer";

type Props = {
	params: {
		id: string;
	};
};

export default function AnswerPage({ params: { id } }: Props) {
	const initialQuestion = decodeURIComponent(id);
	return <Answer initialQuestion={initialQuestion} />;
}
