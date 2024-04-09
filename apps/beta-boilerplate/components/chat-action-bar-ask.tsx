import { ChatActionBar, ChatActionBarColumn } from "@/components/chat-action-bar";
import { ButtonThumbsUp } from "@/components/button-thumbs-up";
import { ButtonThumbsDown } from "@/components/button-thumbs-down";
import { ButtonBookmark } from "@/components/button-bookmark";
import { ButtonShare } from "@/components/button-share";

export function ChatActionBarAsk() {
    return (
        <ChatActionBar>
            <ChatActionBarColumn>
                <ButtonThumbsUp />
                <ButtonThumbsDown />
            </ChatActionBarColumn>
            <ChatActionBarColumn>
                <ButtonShare />
                <ButtonBookmark />
            </ChatActionBarColumn>
        </ChatActionBar>
    );
}
