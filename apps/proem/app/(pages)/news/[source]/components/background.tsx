import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { useStreamer } from "./bot/fake-it";
import { useTextWithReferences } from "./references/annotated-text";
import { indexPapers, QaTuple } from "./tuple";

type Props = {
	text?: string;
	papers?: ReferencedPaper[];
};

export function Background({ text, papers }: Props) {
	const streamedText = useStreamer(text);
	const isLoading = streamedText?.length !== text?.length;
	const { markup, references, prefix } = useTextWithReferences(streamedText);

	return (
		<QaTuple
			question="What is the factual background?"
			papers={
				papers &&
				indexPapers(papers, (paper) => references.includes(paper?.index + 1))
			}
			prefix={prefix}
			throbber={isLoading}
		>
			{markup}
		</QaTuple>
	);
}
