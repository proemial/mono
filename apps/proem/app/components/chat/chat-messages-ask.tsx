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
		<>
			{messages.map((m, i) => (
				<ChatMessage
					key={i}
					message={m.content}
					user={m.role === "assistant" ? PROEM_BOT : user}
					onShareHandle={m.role === "assistant" ? onShareHandle : null}
					isLoading={isLoading}
					showThrobber={
						m.role === "assistant" && isLoading && i === messages.length - 1
					}
				/>
			))}

			{showLoadingState && <ChatMessage user={PROEM_BOT} />}
		</>
	);
}
