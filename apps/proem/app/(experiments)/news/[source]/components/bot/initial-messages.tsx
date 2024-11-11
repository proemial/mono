import { Message, nanoid } from "ai";
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
							id: nanoid(),
						},
						{
							role: "assistant",
							content: questions?.at(0)?.at(1) ?? "",
							id: nanoid(),
						},
						{
							role: "user",
							content: questions?.at(1)?.at(0) ?? "",
							id: nanoid(),
						},
						{
							role: "assistant",
							content: questions?.at(1)?.at(1) ?? "",
							id: nanoid(),
						},
						{
							role: "user",
							content: questions?.at(2)?.at(0) ?? "",
							id: nanoid(),
						},
						{
							role: "assistant",
							content: questions?.at(2)?.at(1) ?? "",
							id: nanoid(),
						},
					]
				: [],
		[isFromFeed, questions],
	) as Message[];
}
