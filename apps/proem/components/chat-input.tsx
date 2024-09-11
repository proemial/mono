"use client";
import { screenMaxWidth } from "@/app/constants";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { ChatForm, ChatFormProps } from "@/components/chat-form";
import { Button, cn } from "@proemial/shadcn-ui";
import { Stop } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";

type ButtonProps = {
	stop?: ReturnType<typeof useChat>["stop"];
	trackingPrefix: string;
};

type FormProps = ChatFormProps &
	ButtonProps & {
		isLoading?: ReturnType<typeof useChat>["isLoading"];
		onFocusChange?: (isFocused: boolean) => void;
	};

export function ChatInput({
	placeholder,
	onSend,
	isLoading,
	stop,
	onFocusChange,
	trackingPrefix,
}: FormProps) {
	return (
		<div
			className={cn(
				screenMaxWidth,
				"sticky bottom-0 flex justify-center items-center",
			)}
		>
			{isLoading && <StopButton stop={stop} trackingPrefix={trackingPrefix} />}
			{!isLoading && (
				<ChatForm
					placeholder={placeholder}
					onSend={onSend}
					onFocusChange={onFocusChange}
					trackingPrefix={trackingPrefix}
				/>
			)}
		</div>
	);
}

function StopButton({ stop, trackingPrefix }: ButtonProps) {
	const handleStop = () => {
		if (stop) {
			stop();
		}
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.stop}`)();
	};
	return (
		<Button className="w-12 h-12 p-4 mb-12 rounded-full" onClick={handleStop}>
			<Stop className="animate-pulse" />
		</Button>
	);
}
