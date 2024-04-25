"use client";
import { screenMaxWidth } from "@/app/constants";
import { Button } from "@proemial/shadcn-ui";
import { Stop } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { z } from "zod";
import { ChatForm, ChatFormProps } from "./chat-form";
import { analyticsKeys, trackHandler } from "@/app/components/analytics/tracking/tracking-keys";

export const QuerySchema = z.object({
	query: z.string(),
});

type ButtonProps = {
	stop?: ReturnType<typeof useChat>["stop"];
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
}: FormProps) {
	return (
		<div
			className={`${screenMaxWidth} sticky bottom-0 mb-[-16px] flex justify-center items-center`}
		>
			{isLoading && <StopButton stop={stop} />}
			{!isLoading && (
				<ChatForm
					placeholder={placeholder}
					onSend={onSend}
					onFocusChange={onFocusChange}
				/>
			)}
		</div>
	);
}

function StopButton({ stop }: ButtonProps) {
	const handleStop = () => {
		if (stop) {
			stop();
		}
		trackHandler(analyticsKeys.ask.click.stop)();
	}
	return (
		<Button
			className="mb-12 w-12 h-12 p-4 rounded-full"
			onClick={handleStop}
		>
			<Stop className="animate-pulse" />
		</Button>
	);
}
