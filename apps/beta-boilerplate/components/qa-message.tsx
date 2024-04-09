import { QAMessage, QAMessageAuthor } from "@/lib/definitions";
import { ButtonHeart } from "./button-heart";
import { Message, MessageContent, MessageBubble, MessageAction, MessageFooter, MessageAuthor, MessageReplies } from "@/components/ui/message";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// component that takes in a QAMessage and renders it
export function QAEntry({ message }: { message: QAMessage }) {
    return (
        <Message variant={message.type}>
            <MessageContent>
                <MessageBubble>{message.text}</MessageBubble>
                <MessageAction><ButtonHeart small />
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
                    <Button variant="ghost" size="none">REPLY</Button></MessageReplies>
            </MessageFooter>
        </Message>
    );
}