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
import { ButtonHeart } from "./button-heart";

// component that takes in a QAMessage and renders it
export function QAEntry({ message }: { message: any }) {
	return (
		<Message variant={message.type}>
			<MessageContent>
				<MessageBubble>{message.text}</MessageBubble>
				<MessageAction>
					<ButtonHeart small />
					<span className="leading-tight">{message.likes}</span>
				</MessageAction>
			</MessageContent>
			<MessageFooter>
				<MessageAuthor>
					<Avatar className="size-6">
						<AvatarImage src={message.author.avatar} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<p>{message.author.name}</p>
				</MessageAuthor>
				<MessageReplies>
					{message.replies ? <div>{message.replies} REPLIES</div> : <></>}
					<Button variant="ghost" size="none">
						REPLY
					</Button>
				</MessageReplies>
			</MessageFooter>
		</Message>
	);
}
