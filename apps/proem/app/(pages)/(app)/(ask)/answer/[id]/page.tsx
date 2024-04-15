import { Answer } from "./answer";

type Props = {
	params: {
		id: string;
	};
};

export default function AnswerPage({ params: { id } }: Props) {
	const question = decodeURIComponent(id);
	return <Answer question={question} />;
}
