import { ProemLogo } from "@/app/components/icons/brand/logo";
import { UserAvatar } from "@/app/components/user-avatar";
import {
	Message,
	MessageAuthor,
	MessageBubble,
	MessageContent,
	MessageFooter,
} from "@proemial/shadcn-ui";

type QAMessageProps = {
	role: string;
	content: string;
};

export function QAMessage({ content, role }: QAMessageProps) {
	const messageType = role === "user" ? "question" : "answer";
	return (
		<Message variant={messageType} className="space-y-1.5">
			<MessageContent>
				<MessageBubble>{content}</MessageBubble>
				{/* <MessageAction>
					<ButtonHeart small />
					<span className="leading-tight">{message.likes}</span>
				</MessageAction> */}
			</MessageContent>
			<MessageFooter>
				<MessageAuthor>
					{messageType === "question" ? (
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
