import { ProemLogo } from "@/app/components/icons/brand/logo";
import {
	Message,
	MessageAuthor,
	MessageBubble,
	MessageContent,
	MessageFooter,
} from "@proemial/shadcn-ui";
import { User01 } from "@untitled-ui/icons-react";

type QAMessageProps = {
	role: string;
	content: string;
};

export function QAMessage({ content, role }: QAMessageProps) {
	const messageType = role === "user" ? "question" : "answer";
	return (
		<Message variant={messageType}>
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
							<User01 className=" size-6" />
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
