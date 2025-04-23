import { Message, generateId } from "ai";
import { useMemo } from "react";

export function useInitialMessages(
	questions?: Array<[string, string]>,
	isFromFeed?: boolean,
) {
	return useMemo(
		() =>
			isFromFeed
				? [
						{
							role: "user",
							content: questions?.at(0)?.at(0) ?? "",
							id: generateId(),
						},
						{
							role: "assistant",
							content: questions?.at(0)?.at(1) ?? "",
							id: generateId(),
						},
						{
							role: "user",
							content: questions?.at(1)?.at(0) ?? "",
							id: generateId(),
						},
						{
							role: "assistant",
							content: questions?.at(1)?.at(1) ?? "",
							id: generateId(),
						},
						{
							role: "user",
							content: questions?.at(2)?.at(0) ?? "",
							id: generateId(),
						},
						{
							role: "assistant",
							content: questions?.at(2)?.at(1) ?? "",
							id: generateId(),
						},
					]
				: [],
		[isFromFeed, questions],
	) as Message[];
}
