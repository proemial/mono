import { useIsApp } from "@/utils/app";
import { useEffect, useRef } from "react";
import { QaTuple, User } from "../tuple";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { AnnotatedText } from "../references/annotated-text";

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
			papers={papers}
			scrollTo={scrollTo}
		>
			<AnnotatedText>{answer}</AnnotatedText>
		</QaTuple>
	);
}
