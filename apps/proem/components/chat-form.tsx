"use client";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import {
	analyticsKeys,
	trackHandler,
} from "@/app/components/analytics/tracking/tracking-keys";
import { useVisualViewport } from "@/utils/useVisualViewport";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	Textarea,
} from "@proemial/shadcn-ui";
import { ChevronRight } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const QuerySchema = z.object({
	question: z.string(),
});

export type ChatFormProps = {
	placeholder: string;
	onSend?: ReturnType<typeof useChat>["append"];
	onFocusChange?: (isFocused: boolean) => void;
	trackingPrefix: string;
};

export function ChatForm({
	placeholder,
	onSend,
	onFocusChange,
	trackingPrefix,
}: ChatFormProps) {
	const router = useRouter();

	const [isFocused, setIsFocused] = useState(false);

	const form = useForm<z.infer<typeof QuerySchema>>({
		resolver: zodResolver(QuerySchema),
	});

	const { keyboardUp } = useVisualViewport();
	useEffect(() => {
		if (!keyboardUp && !isFocused) {
			setIsFocused(false);
		}
	}, [keyboardUp, isFocused]);

	useEffect(() => {
		!!onFocusChange && onFocusChange(isFocused);
	}, [isFocused, onFocusChange]);

	const askQuestion = (question: string) => {
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.submit.input}`)();
		if (onSend) {
			onSend({ role: "user", content: question });
		} else {
			router.push(`/answer/${encodeURIComponent(question)}`);
		}
	};

	const handleSubmit = (data: z.infer<typeof QuerySchema>) => {
		setTimeout(() => askQuestion(data.question));
	};

	const handleFocus = () => {
		setIsFocused(true);
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.input}`)();
	};

	const handleBlur = () => {
		// Necessary delay to fire the form when the button is clicked and goes invisible
		setTimeout(() => setIsFocused(false), 100);
	};

	const handleFormInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		if (
			(e.code === "Enter" || target.value.includes("\n")) &&
			target.value?.replaceAll("\n", "")?.length
		) {
			setIsFocused(false);
			!!onFocusChange && onFocusChange(false);
			askQuestion(form.getValues("question"));
			form.setValue("question", "");
			return false;
		}
	};

	const handleChange = (textarea: HTMLTextAreaElement) => {
		const initialHeight = 48;
		const expandAt = 72;

		// reset the height to get the correct scrollHeight
		textarea.style.height = `${initialHeight}px`;

		if (textarea.scrollHeight > initialHeight) {
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
				<div className="flex items-center w-full mt-3.5 mb-12 border text-foreground bg-card border-background rounded-3xl">
					<FormField
						control={form.control}
						name="question"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Textarea
										{...field}
										placeholder={placeholder}
										className={`w-full h-12 pl-6 resize-none flex items-center text-lg bg-card
										            placeholder:opacity-40 placeholder:text-[#2b2b2b] dark:placeholder:text-[#e5e5e5] ${
																	isFocused ? "rounded-l-3xl" : "rounded-3xl"
																} ${
																	form.getFieldState("question").invalid
																		? "border border-red-300"
																		: ""
																}`}
										onFocus={handleFocus}
										onBlur={handleBlur}
										onFocusOut={handleBlur} // https://github.com/facebook/react/issues/28492
										onKeyDown={(e) => {
											const target = e.target as HTMLTextAreaElement;
											if (e.code === "Enter" || target.value.includes("\n")) {
												e.preventDefault();
											}
											return handleFormInput(e);
										}}
										onInput={handleFormInput}
										onChange={(e) => {
											handleChange(e.target as HTMLTextAreaElement);
											field.onChange(e);
										}}
										maxLength={chatInputMaxLength}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button
						disabled={
							!!(
								form.formState.isSubmitting ||
								form.getFieldState("question").error ||
								!form.getValues("question")?.trim().length
							)
						}
						className="size-8 w-[36px] mr-2 rounded-full text-background border-[1px] bg-[#2B2B2B] dark:bg-[#e5e5e5] disabled:opacity-1"
						size="icon"
						type="submit"
						onClick={trackHandler(
							`${trackingPrefix}:${analyticsKeys.chat.click.submit}`,
						)}
					>
						<ChevronRight className="size-5" />
					</Button>
				</div>
			</form>
		</Form>
	);
}
