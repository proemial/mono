import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

export type Paper = {
	link: string;
	title: string;
	published: string;
};

type Props = {
	data: ReturnType<typeof useChat>["data"];
	fallback?: Paper[];
};

export const usePapers = ({ data, fallback = [] }: Props) => {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [papers, setPapers] = useState<Paper[]>(fallback);

	const { index, hits } = findLatestByEventType(
		data as AnswerEngineEvents[],
		"papers-fetched",
	);

	useEffect(() => {
		if (hits?.length && index !== currentIndex) {
			setCurrentIndex(index);
			setPapers(hits.at(0)?.papers as Paper[]);
		}
	}, [currentIndex, hits, index, currentIndex]);

	return papers;
};
