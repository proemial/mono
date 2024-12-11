import { ReferencePreview } from "./reference";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Question } from "./chat-message";
import { Answer } from "./chat-message";
import { LoadingMessage } from "./chat-message";
import { Vote } from "@/db/schema";
import { Message } from "ai";
import { OpenReference } from "./reference";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
	id: string;
	messages: Message[];
	isLoading: boolean;
	votes?: Vote[];
	openedReference: OpenReference;
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
};

export const ChatMessages = ({
	id,
	messages,
	isLoading,
	votes,
	openedReference,
	setOpenedReference,
}: Props) => {
	const latest = messages.at(-1);
	const showLoading =
		isLoading &&
		!(
			latest?.role === "assistant" &&
			latest?.toolInvocations?.length === undefined
		);

	const queryClient = useQueryClient();
	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to invalidate the history when the message count changes
	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["history"] });
	}, [messages?.length, queryClient]);

	return (
		<>
			{messages.map((message, index) => {
				if (message.toolInvocations?.length) {
					return undefined;
				}

				if (message.role === "user") {
					return <Question key={message.id} message={message} />;
				}

				const papers = messages
					.at(index - 1)
					?.toolInvocations?.filter(
						(t) => t.state === "result" && t.toolName === "getPapers",
					)
					.flatMap((t) =>
						t.state === "result" ? (t.result as ReferencePreview[]) : [],
					);
				return (
					<Answer
						key={message.id}
						chatId={id}
						message={message}
						papers={papers}
						openedReference={openedReference}
						setOpenedReference={setOpenedReference}
						isLoading={isLoading && messages.length - 1 === index}
						vote={
							votes
								? votes.find((vote) => vote.messageId === message.id)
								: undefined
						}
					/>
				);
			})}

			{showLoading && <LoadingMessage />}
		</>
	);
};
