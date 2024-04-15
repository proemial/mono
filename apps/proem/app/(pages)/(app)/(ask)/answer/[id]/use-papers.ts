import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useEffect, useState } from "react";

export type Paper = {
	link: string;
	title: string;
	published: string;
};

export const usePapers = (data: AnswerEngineEvents[]) => {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [papers, setPapers] = useState<Paper[]>([]);

	const { index, hits } = findLatestByEventType(data, "papers-fetched");

	useEffect(() => {
		if (hits?.length && index !== currentIndex) {
			setCurrentIndex(index);
			setPapers(hits.at(0)?.papers as Paper[]);
		}
	}, [currentIndex, hits, index, currentIndex]);

	return papers;
};
