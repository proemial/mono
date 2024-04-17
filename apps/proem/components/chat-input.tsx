"use client";
import { screenMaxWidth } from "@/app/constants";
import { Button } from "@proemial/shadcn-ui";
import { Stop } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { z } from "zod";
import { ChatForm, ChatFormProps } from "./chat-form";

export const QuerySchema = z.object({
	query: z.string(),
});

type ButtonProps = {
	stop?: ReturnType<typeof useChat>["stop"];
};

type FormProps = ChatFormProps &
	ButtonProps & {
		isLoading?: ReturnType<typeof useChat>["isLoading"];
	};

export function ChatInput({ placeholder, onSend, isLoading, stop }: FormProps) {
	return (
		<div
			className={`${screenMaxWidth} sticky bottom-4 flex justify-center h-[48px]`}
		>
			{isLoading && <StopButton stop={stop} />}
			{!isLoading && <ChatForm placeholder={placeholder} onSend={onSend} />}
		</div>
	);
}

function StopButton({ stop }: ButtonProps) {
	return (
		<Button className="w-12 h-12 rounded-full" onClick={() => !!stop && stop()}>
			<Stop className="w-6 h-6" />
		</Button>
	);
}
