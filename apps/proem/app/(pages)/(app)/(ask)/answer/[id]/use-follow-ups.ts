import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

export const useFollowUps = (data: ReturnType<typeof useChat>["data"]) => {
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [followUps, setFollowUps] = useState<string[]>([]);

	const { index, hits } = findLatestByEventType(
		data as AnswerEngineEvents[],
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
