import { ReferencePreview } from "./reference";

import { Dispatch, SetStateAction } from "react";
import { Question } from "./message";
import { Answer } from "./message";
import { LoadingMessage } from "./message";
import { Vote } from "@/db/schema";
import { Message } from "ai";
import { OpenReference } from "./reference";

type Props = {
	id: string;
	messages: Message[];
	isLoading: boolean;
	votes?: Vote[];
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
};

export const ChatMessages = ({
	id,
	messages,
	isLoading,
	votes,
	setOpenedReference,
}: Props) => {
	const latest = messages.at(-1);
	const showLoading =
		isLoading &&
		!(
			latest?.role === "assistant" &&
			latest?.toolInvocations?.length === undefined
		);

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
