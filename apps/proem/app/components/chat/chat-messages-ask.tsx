import { Message } from "ai";
import { ChatMessage, ChatMessageProps } from "./chat-message-ask";

const PROEM_BOT = {
	name: "proem",
	initials: "P",
	avatar: "/android-chrome-512x512.png",
};

type Props = Required<Pick<ChatMessageProps, "onShareHandle" | "isLoading">> &
	Pick<ChatMessageProps, "user"> & {
		messages: Message[];
		showLoadingState: boolean;
	};

export function ChatMessages(props: Props) {
	const { messages, user, onShareHandle, isLoading, showLoadingState } = props;

	return (
		<div className="w-full pb-20 space-y-5">
			{messages.map((m) => (
				<ChatMessage
					key={m.id}
					message={m.content}
					user={m.role === "assistant" ? PROEM_BOT : user}
					onShareHandle={m.role === "assistant" ? onShareHandle : null}
					isLoading={isLoading}
				/>
			))}

			{showLoadingState ? (
				<ChatMessage
					message="Searching for relevant scientific papers..."
					user={PROEM_BOT}
				/>
			) : null}
		</div>
	);
}
