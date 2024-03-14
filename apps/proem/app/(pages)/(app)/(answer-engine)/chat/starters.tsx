"use client";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import {
	ChatTarget,
	useAskChatState,
	useChatState,
	usePaperChatState,
} from "@/app/components/chat/state";
import { StarterButton } from "@/app/components/proem-ui/link-button";

export function Starters({ target }: { target: ChatTarget }) {
	const { trackingKey, suggestions, appendQuestion } = useStartersState(target);

	// console.log("suggestions", suggestions);

	// const starters = [...STARTERS]
	// 	.map((text, index) => ({ index, text }))
	// 	.sort(() => 0.5 - Math.random())
	// 	.slice(0, 3);

	const trackAndInvoke = (callback: () => void) => {
		Tracker.track(trackingKey);
		callback();
	};

	return (
		<>
			{suggestions.map((suggestion) => (
				<StarterButton
					key={suggestion}
					variant="starter"
					className="w-full mb-2 cursor-pointer"
					onClick={() => {
						trackAndInvoke(() => appendQuestion(suggestion));
					}}
				>
					{suggestion}
				</StarterButton>
			))}
		</>
	);
}

function useStartersState(target: ChatTarget) {
	const isRead = target === "paper";

	const trackingKey = isRead
		? analyticsKeys.read.click.starter
		: analyticsKeys.ask.click.starter;

	const { suggestions, appendQuestion } = useChatState(target);
	// const { suggestions, appendQuestion } = isRead
	// 	? usePaperChatState((state) => ({
	// 		suggestions: state.suggestions,
	// 		appendQuestion: state.appendQuestion,
	// 	}))
	// 	: useAskChatState((state) => ({
	// 		suggestions: state.suggestions,
	// 		appendQuestion: state.appendQuestion,
	// 	}));
	return { trackingKey, suggestions, appendQuestion };
}
