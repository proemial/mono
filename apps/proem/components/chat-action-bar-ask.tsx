import { ButtonBookmark } from "@/components/button-bookmark";
import { ButtonShare } from "@/components/button-share";
import { ButtonThumbsDown } from "@/components/button-thumbs-down";
import { ButtonThumbsUp } from "@/components/button-thumbs-up";
import {
	ChatActionBar,
	ChatActionBarColumn,
} from "@/components/chat-action-bar";

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
