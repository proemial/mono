import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { useStreamer } from "./bot/fake-it";
import { AnnotatedText } from "./references/annotated-text";
import { QaTuple } from "./tuple";

type Props = {
	text?: string;
	papers?: ReferencedPaper[];
};

export function Background({ text, papers }: Props) {
	const streamedText = useStreamer(text);
	const isLoading = streamedText?.length !== text?.length;

	return (
		<QaTuple
			question="What is the factual background?"
			papers={isLoading ? undefined : papers}
			throbber={isLoading}
		>
			<AnnotatedText>{streamedText}</AnnotatedText>
		</QaTuple>
	);
}
