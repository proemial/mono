import { ButtonBookmark } from "@/components/button-bookmark";
import { ButtonHeart } from "@/components/button-heart";
import { ButtonReplies } from "@/components/button-replies";
import { ButtonShare } from "@/components/button-share";
import {
	ChatActionBar,
	ChatActionBarColumn,
} from "@/components/chat-action-bar";

export function ChatActionBarDiscover() {
	return (
		<ChatActionBar>
			<ChatActionBarColumn>
				<div className="flex items-center gap-2">
					<ButtonHeart />
					348
				</div>
				<div className="flex items-center gap-2">
					<ButtonReplies />
					237
				</div>
			</ChatActionBarColumn>
			<ChatActionBarColumn>
				<ButtonShare />
				<ButtonBookmark />
			</ChatActionBarColumn>
		</ChatActionBar>
	);
}
