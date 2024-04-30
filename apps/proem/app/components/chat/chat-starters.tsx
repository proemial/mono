"use client";
import { Tracker } from "@/components/analytics/tracking/tracker";
import { SearchMd } from "@untitled-ui/icons-react";
import { ChatStarter } from "./chat-message";
import { ChatTarget, useChatState } from "./state";
import { useAuth } from "@clerk/nextjs";
import { useDrawerState } from "../login/state";

type Props = {
	target: ChatTarget;
	requiresAuth?: boolean;
	trackingKey: string;
};

export function StarterMessages({ target, requiresAuth, trackingKey }: Props) {
	const { suggestions, addQuestion } = useChatState(target);
	const { readonly, onFocus } = useInputState(target);

	if (suggestions?.length === 0) {
		return null;
	}

	const trackAndInvoke = (text: string) => {
		if (readonly && onFocus) {
			onFocus();
			return;
		}

		Tracker.track(trackingKey, {
			text,
		});

		addQuestion(text);
	};

	return (
		<>
			<div className="flex items-center font-sourceCodePro">
				<SearchMd
					style={{ height: "12px", strokeWidth: "3" }}
					className="w-4"
				/>
				SUGGESTED QUESTIONS
			</div>
			{suggestions.slice(0, 3).map((suggestion) => (
				<ChatStarter
					key={suggestion}
					onClick={() => trackAndInvoke(suggestion)}
					requiresAuth={requiresAuth}
				>
					{suggestion}
				</ChatStarter>
			))}
		</>
	);
}

function useInputState(target: ChatTarget) {
	const isRead = target === "paper";

	const { userId } = useAuth();
	const readonly = isRead && !userId;

	const { open } = useDrawerState();
	const onFocus = isRead && !userId && open;

	return { readonly, onFocus };
}
