import { applyExplainLinks } from "@/components/chat-apply-links";
import { ProemLogo } from "@/components/icons/brand/logo";
import { UserAvatar } from "@/components/user-avatar";
import {
	Message,
	MessageAuthor,
	MessageBubble,
	MessageContent,
	MessageFooter,
} from "@proemial/shadcn-ui";

type QAMessageProps = {
	role: "user" | "assistant";
	content: string | undefined;
	onExplainerClick: (msg: string) => void;
};

export function QAMessage({
	role,
	content = "",
	onExplainerClick,
}: QAMessageProps) {
	if (!content) {
		return undefined;
	}

	return (
		<Message
			variant={role === "user" ? "question" : "answer"}
			className="space-y-1.5"
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
							<UserAvatar />
							<p>You</p>
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
		</Message>
	);
}
