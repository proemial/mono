import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { useStreamer } from "./bot/fake-it";
import { useTextWithReferences } from "./references/parse-references";
import { indexPapers, QaTuple } from "./tuple";

type Props = {
	text?: string;
	papers?: ReferencedPaper[];
	activeColors?: { foreground?: string; background?: string };
};

export function Background({ text, papers, activeColors }: Props) {
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
			activeColors={activeColors}
		>
			{markup}
		</QaTuple>
	);
}
