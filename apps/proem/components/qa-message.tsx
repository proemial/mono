import { applyExplainLinks } from "@/components/chat-apply-links";
import { ProemLogo } from "@/components/icons/brand/logo";
import { UserAvatar } from "@/components/user-avatar";
import { UserData } from "@/services/post-service";
import { useUser } from "@clerk/nextjs";
import {
	MessageAuthor,
	MessageBubble,
	Message as MessageComponent,
	MessageContent,
	MessageFooter,
} from "@proemial/shadcn-ui";
import { Message } from "ai";
import { useMemo } from "react";

type QAMessageProps = {
	message:
		| (Message & {
				authorUserData?: UserData;
		  })
		| undefined;
	onExplainerClick: (msg: string) => void;
};

export function QAMessage({ message, onExplainerClick }: QAMessageProps) {
	if (!message?.content) {
		return undefined;
	}
	const { role, content, authorUserData } = message;
	const { user, isLoaded, isSignedIn } = useUser();
	const authorName = useMemo(() => {
		if (authorUserData) {
			return `${authorUserData.firstName} ${authorUserData.lastName}`;
		}
		if (isLoaded && isSignedIn && user) {
			return `${user.firstName} ${user.lastName}`;
		}
		return "You";
	}, [authorUserData, isLoaded, isSignedIn, user]);

	return (
		<MessageComponent
			variant={role === "user" ? "question" : "answer"}
			className="space-y-0.5"
		>
			<MessageContent>
				<MessageBubble>
					{role === "assistant"
						? applyExplainLinks(content, onExplainerClick)
						: content}
				</MessageBubble>
				{/* <MessageAction>
					<ButtonHeart small />
					<span className="leading-tight">{message.likes}</span>
				</MessageAction> */}
			</MessageContent>
			<MessageFooter>
				<MessageAuthor>
					{role === "user" ? (
						<>
							<UserAvatar authorUserData={authorUserData} />
							<p>{authorName}</p>
						</>
					) : (
						<>
							<div className="size-6 flex justify-center items-center">
								<ProemLogo size="xs" />
							</div>
							<p>Proem</p>
						</>
					)}
				</MessageAuthor>
				{/* <MessageReplies>
					{message.replies ? <div>{message.replies} REPLIES</div> : <></>}
					<Button variant="ghost" size="none">
						REPLY
					</Button>
				</MessageReplies> */}
			</MessageFooter>
		</MessageComponent>
	);
}
