"use client";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/app/components/analytics/tracking/tracker";
import { useChatState } from "@/app/components/chat/state";
import { ClearIcon } from "@/app/components/icons/menu/clear-icon";
import { Message } from "ai";

export function ClearButton() {
	const { loading, question } = useChatState("ask");
	const visible = question;

	console.log("ClearButton", loading);

	return (
		<>
			<div
				className={`${
					// TODO: Fix fade in/out
					visible ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>
		</>
	);
}

type Props = {
	isLoading: boolean;
	messages: Message[];
	stop: () => void;
	clear: () => void;
	trackingPrefix: string;
};

export function ClearButtonOld(props: Props) {
	const { isLoading, messages, clear, stop, trackingPrefix } = props;
	const visible = !isLoading && messages.length > 0;
	const trackAndInvoke = (key: string, callback: () => void) => {
		Tracker.track(key);
		callback();
	};

	return (
		<>
			<div
				onClick={() =>
					trackAndInvoke(
						`${trackingPrefix}:${analyticsKeys.chat.click.stop}`,
						() => {
							stop();
							clear();
						},
					)
				}
				className={`${
					// TODO: Fix fade in/out
					isLoading ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>

			<div
				onClick={() =>
					trackAndInvoke(
						`${trackingPrefix}:${analyticsKeys.chat.click.clear}`,
						() => clear(),
					)
				}
				className={`${
					// TODO: Fix fade in/out
					visible ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>
		</>
	);
}
