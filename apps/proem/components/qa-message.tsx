import { ProemLogo } from "@/app/components/icons/brand/logo";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Message,
	MessageAction,
	MessageAuthor,
	MessageBubble,
	MessageContent,
	MessageFooter,
	MessageReplies,
} from "@proemial/shadcn-ui";
import { User01 } from "@untitled-ui/icons-react";
import { ButtonHeart } from "./button-heart";

export function QAEntry({ message }: { message: any }) {
	return (
		<Message variant={message.type}>
			<MessageContent>
				<MessageBubble>{message.text}</MessageBubble>
				{/* <MessageAction>
					<ButtonHeart small />
					<span className="leading-tight">{message.likes}</span>
				</MessageAction> */}
			</MessageContent>
			<MessageFooter>
				<MessageAuthor>
					{message.author.avatar ? (
						<div className="size-6 flex justify-center items-center">
							<ProemLogo size="xs" />
						</div>
					) : (
						<User01 className=" size-6" />
					)}
					<p>{message.author.name}</p>
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
