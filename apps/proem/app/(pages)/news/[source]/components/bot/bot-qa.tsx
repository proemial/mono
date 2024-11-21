import { useIsApp } from "@/utils/app";
import { useEffect, useRef } from "react";
import { QaTuple, User, indexPapers } from "../tuple";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { useTextWithReferences } from "../references/annotated-text";

export function BotQa({
	question,
	answer,
	user,
	papers,
	scrollTo,
}: {
	question: string;
	answer?: string;
	user?: User;
	papers?: ReferencedPaper[];
	scrollTo?: boolean;
}) {
	const isApp = useIsApp();
	const qaRef = useRef<HTMLDivElement>(null);
	const { markup, references } = useTextWithReferences(answer);

	useEffect(() => {
		if (typeof window !== "undefined" && scrollTo && qaRef.current) {
			const yOffset = isApp ? -82 : -64;
			const y =
				qaRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	}, [scrollTo, isApp]);

	return (
		<QaTuple
			question={question}
			user={user}
			papers={
				papers &&
				indexPapers(papers, (paper) => references.includes(paper?.index + 1))
			}
			scrollTo={scrollTo}
		>
			{markup}
		</QaTuple>
	);
}
