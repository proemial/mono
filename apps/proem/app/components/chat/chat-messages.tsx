import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { useUser } from "@clerk/nextjs";
import { Message as AiMessage } from "ai";
import { UseChatHelpers } from "ai/react";
import { ChatMessage, ChatStarter } from "./chat-message";
import { limit } from "@proemial/utils/array";

type MessagesProps = {
	chat: UseChatHelpers;
};

export function ChatMessages({ chat }: MessagesProps) {
	const { messages, append } = chat;

	const { user } = useUser();
	const userProfile = getProfileFromUser(user);

	const appendQuestion = (question: string) =>
		append({ role: "user", content: question });

	const handleExplainerClick = (msg: string) => {
		Tracker.track(analyticsKeys.read.click.explainer, { msg });
		appendQuestion(`What is ${msg}?`);
	};

	// const chatWrapperRef = React.useRef<HTMLDivElement>(null);
	// React.useEffect(() => {
	// 	if (chat.messages?.length > 0 && chatWrapperRef.current) {
	// 		chatWrapperRef.current.scrollIntoView(false);
	// 	}
	// }, [chat.messages]);

	return (
		<>
			<div className="flex flex-col justify-end gap-4">
				{messages?.map((message, i) => (
					<ChatMessage
						key={i}
						message={message}
						user={userProfile}
						onExplainerClick={handleExplainerClick}
					/>
				))}
			</div>
		</>
	);
}

type StartersProps = {
	chat: UseChatHelpers;
	starters: string[];
};

export function StarterMessages({ starters, chat }: StartersProps) {
	const appendQuestion = (question: string) =>
		chat.append({ role: "user", content: question });

	const handleStarterClick = (question: string) => {
		Tracker.track(analyticsKeys.read.click.starter, { question });
		appendQuestion(question);
	};

	return (
		<>
			{limit(starters?.filter(Boolean), 3).map((question) => (
				<ChatStarter
					key={question}
					onClick={() => handleStarterClick(question)}
				>
					{question}
				</ChatStarter>
			))}
		</>
	);
}
