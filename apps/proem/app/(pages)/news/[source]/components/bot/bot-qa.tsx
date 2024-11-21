import { useIsApp } from "@/utils/app";
import { useEffect, useRef } from "react";
import { QaTuple } from "../tuple";
import { ReferencedPaper } from "@proemial/adapters/redis/news";

const references = [
	{
		title: "Emerging Markets Response to Trade Tensions",
		date: "2024-10-05",
		journal: "Development Economics Review",
		author: "Dr. Robert Kumar",
		university: "Oxford University",
	},
	{
		title: "Digital Trade and Cross-Border Data Flows",
		date: "2024-09-15",
		journal: "Technology Policy Review",
		author: "Dr. Lisa Anderson",
		university: "UC Berkeley",
	},
];

export function BotQa({
	question,
	answer,
	user,
	scrollTo,
	isLoading,
}: {
	question: string;
	answer?: string;
	user?: {
		avatar: string;
		name: string;
		backgroundColor: string;
	};
	scrollTo?: boolean;
	isLoading?: boolean;
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

	const papers = references.map(
		(paper, index) =>
			({
				id: index.toString(),
				abstract: "",
				primary_location: "",
				authorships: [],
				created: "",
				published: "",
				...paper,
			}) as unknown as ReferencedPaper,
	);

	return (
		<QaTuple
			question={question}
			user={user}
			papers={isLoading ? undefined : papers}
			scrollTo={scrollTo}
		>
			{answer}
		</QaTuple>
	);
}
