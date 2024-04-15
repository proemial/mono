import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useEffect, useState } from "react";

export const useFollowUps = (data: AnswerEngineEvents[]) => {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [followUps, setFollowUps] = useState<string[]>([]);

	const { index, hits } = findLatestByEventType(
		data,
		"follow-up-questions-generated",
	);

	useEffect(() => {
		if (hits?.length && index !== currentIndex) {
			setCurrentIndex(index);
			setFollowUps(hits.at(0)?.map((followUp) => followUp.question) || []);
		}
	}, [currentIndex, hits, index, currentIndex]);

	return followUps;
};
